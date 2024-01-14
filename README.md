# 🔧 Game Engine 
This is a super simple react app that takes a set JSON structure - imported from github to allow instant updates without a redeploy - and parsed into a looping choose-your-own-path style text adventure.
<details>
<summary>Example JSON Schema</summary>

```
{
     "1": [
        {
            "text": "Beginning"
        },
        {
            "text": "continuation"
        },
        {
             "continuity-text": "[OPTIONAL] Some common text to append to option actions",
                "options": [
                {
                    "text": "Option one text to display",
                    "action": "Action text to display after selected"
                },
                {
                    "text": "Option two text to display",
                    "action": "Action text to display after selected"
                },
                {
                    "text": "Option three text to display",
                    "action": "Action text to display after selected",
                    "story-level": Story level indicates which json key to go to next,
                    "chapter-level": Chapter level indicates which array element of a story level to start at
                }
            ]
        },
     ],
     "2": [
            {
                "text": "The story continues"
            },
            {
                 "options": [
                {
                    "text": "Loop back to the start",
                    "action": "You loop back to story part 1, chapter 0",
                    "story-level": 1,
                    "chapter-level": 0
                },
                 ]
            }
        ]
    }
```
</details>

# 🎰 Current game(s) 
### Odyssey
Embark on a surreal journey through shifting realities, where the protagonist navigates cosmic mysteries and confronts existential choices. The tale unfolds in a universe of uncertainty, blending the ethereal and the profound, culminating in a pivotal choice that shapes the very fabric of existence.

# 🏃 Running locally
Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/) (Node Package Manager) installed

- Clone this repository
- Open a terminal and navigate to the route of this project
- Run `npm i` and handle any dependency issues if needed
- Run `npm run start`
- Enjoy!

# ✍️ Contributing 
If you would like to contribute your own story, please get in touch with me!