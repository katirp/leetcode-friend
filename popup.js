import { getLeetcodeData } from './api/leetcode.js';
import { Friend } from './friend.js';

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
document.addEventListener('DOMContentLoaded', async () => {
    // load username
    chrome.storage.local.get(['leetcodeUsername'], async (result) => {
        if (result.leetcodeUsername) {
            document.getElementById('username').value = result.leetcodeUsername;
            document.getElementById('status').textContent = 'Username loaded!';
            try {
                const { recentSubmissions, submissionCalendar } = await getLeetcodeData(result.leetcodeUsername);
                console.log('Recent submissions:', recentSubmissions);
                console.log('Submission Calendar:', submissionCalendar);
                console.log(processLeetCodeData(recentSubmissions, submissionCalendar));
            } catch (error) {
                console.error('Failed to fetch submissions:', error);
            }
        } else {
            console.log('No username saved.');
        }
    });
    newFriend = await Friend.loadState();
    console.log(newFriend);
    updateDisplay(newFriend);
});

// age up button
document.getElementById('ageButton').addEventListener('click', () => {
    if (newFriend) {
        newFriend.increaseAge(1);
        updateDisplay(newFriend);
        newFriend.saveState();
    } else {
        console.error('Friend Object is not initialized')
    }
});

document.getElementById('decHealth').addEventListener('click', () => {
    if (newFriend) {
        newFriend.decreaseHealth(1);
        updateFriend(newFriend);
        updateDisplay(newFriend);
    } else {
        console.error('Friend Object is not initialized');
    }
});

// refresh image and text on display
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

function processLeetCodeData(recentSubmissions, submissionCalender) {
    // get the earliest "Accepted" timestamp for each titleSlug
    const earliestAccepted = recentSubmissions
        .filter(sub => sub.statusDisplay === 'Accepted') // Only consider accepted submissions
        .reduce((acc, sub) => {
            if (!acc[sub.titleSlug] || sub.timestamp < acc[sub.titleSlug]) {
                // Update the timestamp if it's earlier than the existing one
                acc[sub.titleSlug] = sub.timestamp;
            }
            return acc;
        }, {});

    // Get distinct submission days from the earliest timestamps
    const submissionDays = new Set(
        Object.values(earliestAccepted).map(timestamp =>
            Math.floor(timestamp / 86400) // Convert to days
        )
    );

    return submissionDays; // Return distinct days

    // // Use the submissionCalendar as a fallback for days without recentSubmissions
    // const fallbackDays = Object.keys(submissionCalendar)
    //     .filter(day => day > lastCheckedTimestamp / 1000) // Only consider days since the last check
    //     .map(day => parseInt(day, 10));

    // // Merge both sets of submission days
    // fallbackDays.forEach(day => submissionDays.add(day));

    // // Return the processed submission days
    // return Array.from(submissionDays);
}

function updateFriend(friend) {
    // function updateFriend(friend, submissionDays, lastDateChecked) {
    // const missedDays = 0;
    // const currentDay = Math.floor(Date.now() / 86400000);
    // const lastDay = Math.floor(lastDateChecked / 86400000);
    // // calculate the number of missed days
    // for (let day = lastDay; day < currentDay; day++) {
    //     if (!submissionDays.includes(day)) {
    //         missedDays += 1;
    //     }
    // }

    // friend.decreaseHealth(missedDays);

    // // TODO: increase health by extra submissions
    // // Problem: If you do it this way, an infinite amount of days could pass and you would just need to do 3 extra problems before opening the extension to keep the friend alive.

    // // update the age by days elapsed
    // friend.increaseAge(currentDay - lastDay);

    // // decrease days until evolution by days elapsed
    // friend.decreaseDaysUntilEvolution(currentDay - lastDay);

    console.log(friend);
    if (friend.daysUntilEvolution === 0 && friend.health === 3 && friend.evolutionStage < 2) {
        friend.evolve();
    }

    if (friend.health < 1) {
        friend.die();
    }

    if (friend.health >= 1) {
        friend.saveState();
    }
}