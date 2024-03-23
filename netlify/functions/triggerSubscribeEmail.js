// 2023-03-21

// When the event is triggered, this invokes the function and the fetch call to an email handler.

exports.handler = async (event) => {
  // console.info("TRIGEV:", event);
  console.log(`Email handler received email request from path ${event.rawUrl}`);
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "POST" },
    };
  }

  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify("Payload is required"),
    };
  }

  const requestBody = JSON.parse(event.body);
  console.log("TRIGEV2: ", requestBody);

  //automatically generated snippet from the email preview
  //sends a request to an email handler for a subscribed email
  let response;
  try {
    console.log(
      "TRIG2: ",
      JSON.stringify({
        from: requestBody.subscriberEmail,

        to: "dma4115@gmail.com",
        subject: "You've been subscribed via test domain",
        parameters: {
          name: requestBody.subscriberName,
        },
      })
    );
    console.log(
      "TRIG3: PROCESS ENV ",
      process.env.URL,
      process.env.NETLIFY_EMAILS_SECRET,
      process.env.NETLIFY_EMAILS_DIRECTORY
    );
    response = await fetch(
      `${process.env.URL}/.netlify/functions/emails/subscribed`,
      {
        headers: {
          "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET,
        },
        method: "POST",
        body: JSON.stringify({
          from: requestBody.subscriberEmail,
          to: process.env.NETLIFY_TEST_TOEMAIL,
          subject: "You've been subscribed via test domain",
          parameters: {
            name: requestBody.subscriberName,
          },
        }),
      }
    );

    console.log("TRIGRESP: ", response);

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      console.log("TRIGEV3: ", response);
      throw new Error(message);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        body: response.message,
        message: "return from serverless function",
      }),
    };
  } catch (error) {
    console.log(`The email process failed with ${error}`);

    return {
      statusCode: error.statusCode || 500,
      body: `Error Sending email: ${error.message}`,
    };
  }
};
