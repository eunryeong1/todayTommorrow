import { PrismaClient } from "@prisma/client";
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();

const router = express.Router();
fs.readdir("uploads", (error) => {
  if (error) {
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cd) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 104 * 1024 },
});

router.post("img", upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post("/", upload2.none(), async (req, res, next) => {
    try {
        const { title, description, fromDate, toDate, } = req.body;
        const { img } = req.url
        const post = await prisma.challenge.create({
            data: {
                title,
                description,
                fromDate,
                toDate,
                img,
            }
        })
    }
});

const uploa
