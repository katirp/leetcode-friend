// format data 
const formatData = (data) => {
    let sendData =  {
        submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
        recentSubmissions: data.recentSubmissionList,
    }
    return sendData;
  }

export async function getLeetcodeData(user) {
    //graphql query
    const query = `
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
            submissionCalendar
        }
        recentSubmissionList(username: $username) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
            __typename
        }
    }
    `;
    
    const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
        },
        body: JSON.stringify({ query, variables: { username: user } }),
      });
    
      const data = await response.json();
    
      if (data.errors) {
        throw new Error(JSON.stringify(data.errors));
      }
    
      return formatData(data.data);
}