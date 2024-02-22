import nodemailer from 'nodemailer';

const WEATHER_KEY = process.env.WEATHER_API_KEY;
const HANOIKEY = '1-353412_1_AL';

export async function GET(req, res) {
  // Fetch dữ liệu thời tiết ngày hôm nay
  const forecastRequest = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${HANOIKEY}?apikey=${WEATHER_KEY}`
  );
  const forecastData = await forecastRequest.json();

  // Fetch random quote
  const randomQuote = await fetch('https://api.quotable.io/random').then(
    (data) => data.json()
  );
  function fahrenheitToCelsius(fahrenheit) {
    var celsius = ((fahrenheit - 32) * 5) / 9;
    return celsius.toFixed(1);
  }

  // Định cấu hình cho máy chủ SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'papadracula141@gmail.com',
      pass: 'xdpo twze jpve tgsh',
    },
  });
  const HTML = `
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dự báo thời tiết và Trích dẫn</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .quote {
            font-style: italic;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .quote-content {
            margin: 0;
        }
        .weather {
            margin-top: 20px;
        }
        .luv {
            color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Dự báo thời tiết và 1 câu quote ngẫu nhiên</h2>
        <div class="weather">
            <h3>Dự báo thời tiết hôm nay</h3>
            <p>Thời tiết: <strong>${forecastData?.Headline?.Text} -- ${
    forecastData?.Headline?.Category
  }</strong></p>
            <p>Nhiệt độ: <strong>Từ ${fahrenheitToCelsius(
              Number(forecastData.DailyForecasts[0].Temperature.Minimum.Value)
            )}°C tới ${fahrenheitToCelsius(
    Number(forecastData.DailyForecasts[0].Temperature.Maximum.Value)
  )}°C</strong></p>
        </div>
        <div class="quote">
            <h3>Trích dẫn ngẫu nhiên</h3>
            <p class="quote-content">${randomQuote.content}</p>
        </div>
        <h1 class="luv">
            Ngày mới tốt lành và yêuuu Thảooo &hearts;&hearts;&hearts;
        </h1>
    </div>
</body>
</html>
  `;

  // Setup các option cho email
  const mailOptions = {
    from: 'papadracula141@gmail.com',
    to: 'nguyentuanh141.uet.vnu@gmail.com, phuongthaohyhy2k1@gmail.com',
    subject: 'Dự báo thời tiết ngày hôm nay cho em iuu <3',
    html: HTML,
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred:', error.message);
      res.status(500).send('Error occurred while sending email.');
    } else {
      console.log('Email sent successfully!');
      res.send('Email sent successfully!');
    }
  });

  return new Response('Email was sent!', {
    status: 200,
  });
}
