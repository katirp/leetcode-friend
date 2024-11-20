import {getLeetcodeData} from './api/leetcode.js'

console.log("This is a popup!")

// Function to save the username to Chrome storage
document.getElementById('saveButton').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
  
    if (username) {
      // Save username to Chrome's storage
      chrome.storage.local.set({ leetcodeUsername: username }, () => {
        document.getElementById('status').textContent = 'Username saved successfully!';
      });
    } else {
      document.getElementById('status').textContent = 'Please enter a valid username.';
    }
  });
  
  // Retrieve and display the username if it exists
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['leetcodeUsername'], async (result) => {
        
        if (result.leetcodeUsername) {
        document.getElementById('username').value = result.leetcodeUsername;
        document.getElementById('status').textContent = 'Username loaded!';
        try {
            const submissions = await getLeetcodeData(result.leetcodeUsername);
            console.log('Recent submissions:', submissions);
          } catch (error) {
            console.error('Failed to fetch submissions:', error);
          }
      } else {
        console.log('No username saved.');
      }
    });
  });
  