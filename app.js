require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/send-mail", async (req, res) => {
  const { name, company, contact, category, content, email } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail", // 사용하는 이메일 서비스에 맞게 설정
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PW,
    },
  });

  let categoryContent =
    category == 0
      ? "견적"
      : category == 1
      ? "컨설팅"
      : category == 2
      ? "자료요청"
      : category == 3
      ? "시연"
      : "기타";

  // 이메일 데이터 설정
  let mailOptions = {
    from: email,
    to: process.env.GET_ID,
    subject: `새 문의사항: ${name}`,
    text: `
      보낸 사람: ${name}
      회사: ${company}
      연락처: ${contact}
      카테고리: ${categoryContent}
      문의사항: ${content}
    `,
  };

  try {
    // 이메일 발송
    transporter.sendMail(mailOptions);
    res.json({ success: true, message: "메일이 전송되었습니다." });
  } catch (error) {
    console.error("이메일 발송 오류:", error);
    res.json({ success: false, message: "메일 전송에 실패했습니다." });
  }
});

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
