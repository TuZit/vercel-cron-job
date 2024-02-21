import nodemailer from 'nodemailer';

const WEATHER_KEY = process.env.WEATHER_API_KEY;
const HANOIKEY = '1-353412_1_AL';

export async function GET(req, res) {
  // Fetch dữ liệu thời tiết ngày hôm nay
  const forecastRequest = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${HANOIKEY}?apikey=${WEATHER_KEY}`
  );
  const forecastData = await forecastRequest.json();
  console.log('aaaaaaaaaaaaaaaaaaaaa', forecastData);

  // Định cấu hình cho máy chủ SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'papadracula141@gmail.com',
      pass: 'xdpo twze jpve tgsh',
    },
  });

  const mailOptions = {
    from: 'papadracula141@gmail.com',
    to: 'nguyentuanh141.uet.vnu@gmail.com',
    subject: 'Your Daily Weather Report Test',
    text: 'Plaintext version of the message -> test',
    html: `
    <h1>${forecastData?.Headline?.Text}</h1>
    <p>${forecastData?.Headline?.Category}</p>
    <ul>
    <li>Temp Min: ${forecastData.DailyForecasts[0].Temperature.Minimum.Value}° ${forecastData.DailyForecasts[0].Temperature.Minimum.Unit}</li>
    <li>Temp Max: ${forecastData.DailyForecasts[0].Temperature.Maximum.Value}° ${forecastData.DailyForecasts[0].Temperature.Maximum.Unit}</li>
    </ul>
    <button>${forecastData?.Headline?.Link}</button>
    `,
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    console.log(
      '================================================================>',
      info
    );
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
