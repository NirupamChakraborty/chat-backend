import "dotenv/config";

export const getOpenAiResponse = async (messages) => {
    const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        //   'HTTP-Referer': 'https://myapp.com', // Your app's URL
        //   'X-Title': 'My AI Assistant', // Your app's display name
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: messages,
            },
          ],
        }),
      };
      try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', options);
            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content;
            console.log("Assistant reply:", content);
            return content || "Sorry, I couldn’t get a reply.";
            // console.log(data.choices[0].message.content);
            

      } catch (error) {
            console.log(error)
      }
}

;