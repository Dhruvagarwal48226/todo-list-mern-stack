import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { collectionName, connection } from "./dbconfig.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies
  })
);

// ================== JWT SECRET ==================
const JWT_SECRET = "Google";

// ================== SIGNUP ==================
app.post("/signup", async (req, res) => {
  const userdata = req.body;

  if (userdata.email && userdata.password) {
    const db = await connection();
    const collection = db.collection("user");

    // Optional: Check if user already exists
    const existingUser = await collection.findOne({ email: userdata.email });
    if (existingUser) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    const result = await collection.insertOne(userdata);

    if (result.insertedId) {
      // ✅ FIX: Create JWT and store in cookie
      jwt.sign(userdata, JWT_SECRET, { expiresIn: "5d" }, (error, token) => {
        if (error)
          return res.send({ success: false, message: "Token generation failed" });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // set true in production with HTTPS
          sameSite: "lax",
        });

        res.send({
          success: true,
          message: "Signup successful",
          token,
        });
      });
    } else {
      res.send({
        success: false,
        message: "Signup failed",
      });
    }
  } else {
    res.send({
      success: false,
      message: "Email and password required",
    });
  }
});

// ================== LOGIN ==================
app.post("/login", async (req, res) => {
  const userdata = req.body;

  if (userdata.email && userdata.password) {
    const db = await connection();
    const collection = db.collection("user");

    const result = await collection.findOne({
      email: userdata.email,
      password: userdata.password,
    });

    if (result) {
      // ✅ FIX: Set cookie after
      jwt.sign(userdata, JWT_SECRET, { expiresIn: "10d" }, (error, token) => {
        if (error)
          return res.send({ success: false, message: "Token generation failed" });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });

        res.send({
          success: true,
          message: "Login successful",
          token,
        });
      });
    } else {
      res.send({
        success: false,
        message: "Invalid email or password",
      });
    }
  } else {
    res.send({
      success: false,
      message: "Email and password required",
    });
  }
});

// ================== VERIFY JWT TOKEN ==================
function verifyJWTToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Token not provided",
    });
  }

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).send({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = decoded;
    next();
  });
}


app.get("/tasks", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    // OPTIONAL: if tasks should be user-specific, filter by user (e.g., ownerId)
    // const result = await collection.find({ ownerId: req.user.email }).toArray();
    const result = await collection.find().toArray();

    return res.status(200).json({
      success: true,
      message: "Task list fetched",
      result: Array.isArray(result) ? result : [],
    });
  } catch (err) {
    console.error("/tasks error:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: err.message,
    });
  }
});


// ================== GET TASK BY ID ==================
app.get("/task/:id", verifyJWTToken , async (req, res) => {
  const { id } = req.params;
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.findOne({ _id: new ObjectId(id) });

  if (result) {
    res.send({
      success: true,
      message: "Task fetched",
      result,
    });
  } else {
    res.send({
      success: false,
      message: "Task not found",
    });
  }
});

// ================== UPDATE TASK ==================
 app.put("/update-task", async (req, res) => {
  const {_id, ...fields } = req.body;
  const db = await connection();
  const collection = db.collection(collectionName);
  const update = { $set: fields };
  const result = await collection.updateOne({ _id: new ObjectId(_id) }, update);
  if (result.modifiedCount > 0) {
    res.send({
      success: true,
      message: "Task updated",
    });
  } else {
    res.send({
      success: false,
      message: "Task not updated",
    });
  }
});


// ================== DELETE SINGLE TASK ==================
app.delete("/delete/:id",  verifyJWTToken , async (req, res) => {
  const { id } = req.params;
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount > 0) {
    res.send({
      success: true,
      message: "Task deleted",
    });
  } else {
    res.send({
      success: false,
      message: "Task not deleted",
    });
  }
});
// ------------------- ADD TASK ------------------- 
 app.post("/add-task",  verifyJWTToken , async (req, res) => {
   const db = await connection();
   const collection = db.collection(collectionName);
   const result = await collection.insertOne(req.body);
    if (result) 
      { res.send({ message: "new task added", success: "true", result, }); }
     else { res.send({ message: "task not added", success: "false", result, }); } });

// ================== DELETE MULTIPLE TASKS ==================
app.delete("/delete-multiple",  verifyJWTToken , async (req, res) => {
  const ids = req.body;
  const db = await connection();
  const collection = db.collection(collectionName);

  const objectIds = ids.map((id) => new ObjectId(id));
  const result = await collection.deleteMany({ _id: { $in: objectIds } });

  if (result.deletedCount > 0) {
    res.send({
      success: true,
      message: "Tasks deleted successfully",
    });
  } else {
    res.send({
      success: false,
      message: "No tasks deleted",
    });
  }
});

// ================== SERVER ==================
app.listen(3200, () => {
  console.log("✅ Server running on http://localhost:3200");
});
