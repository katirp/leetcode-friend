import { getLeetcodeData } from './api/leetcode.js'
import { Friend } from './friend.js'

let newFriend;

// Save username button clicked
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

// DOM content loaded 
document.addEventListener('DOMContentLoaded', () => {
    // load username
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
    newFriend = new Friend();
    updateDisplay(newFriend);
});

document.getElementById('ageButton').addEventListener('click', () => {
    if (newFriend) {
        newFriend.increaseAge();
        updateDisplay(newFriend);
    } else {
        console.error('Friend Object is not initialized')
    }
});

function updateDisplay(friend) {
    const imageElement = document.getElementById('characterImage');
    const statsElement = document.getElementById('characterStats');

    if (!imageElement || !statsElement) {
        console.error('DOM elements not found!');
        return;
    }

    imageElement.src = friend.image;
    statsElement.textContent = `Health: ${friend.health}, Age: ${friend.age}`;
    console.log(`Updated image to: ${friend.image}`);
    console.log(`Updated stats to: Health - ${friend.health}, Age - ${friend.age}`);
}
  