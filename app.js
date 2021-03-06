const express = require("express");
const cors = require("cors");
const html_to_pdf = require("html-pdf-node");
const fs = require("fs");
const { buildComponents, buildTemplate } = require("./utils");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  let data = req.body;
  let options = { format: "A4" };
  let html = fs.readFileSync("./template.html", { encoding: "utf-8" });
  let render = buildTemplate(html, buildComponents(data));
  let file = { content: render };

  // console.log("app", file);

  fs.writeFileSync("./data.html", render, { encoding: "utf-8" });

  html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    fs.writeFileSync(`${data.referenceNumber}.pdf`, pdfBuffer);
    res.status(200).send(`${data.referenceNumber}.pdf`);
  });
});

app.get("/", (req, res) => res.json({ status: "OK", code: 200 }));

app.listen(3000, () => console.log(`server up and running`));
