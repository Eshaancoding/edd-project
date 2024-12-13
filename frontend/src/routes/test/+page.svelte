<script lang="ts">
    import { callLLMCustom } from "$lib/LLM";

    function randomInterest (arr: string[]) {
        return arr[Math.floor(Math.random() * arr.length)]    
    }

    let interestsOne = [
        "Piano",
        "Space",
        "Math",
        "Computer",
        "Chess"
    ]

    let interestTwo = [
        "Productivity",
        "Video Games",
        "Coding",
        "Algorithms",
        "Entrepreneurship"
    ]

    let text = ""
    let customPrompt = ""
    async function b () {
        text = await callLLMCustom ([
            randomInterest(interestsOne),
            randomInterest(interestTwo),
        ], customPrompt)
    }
</script>
<div class="p-2">
    <p>Interests one: {interestsOne.join(", ")} </p><br />
    <p>Interests two: {interestTwo.join(", ")} </p><br />
    <p>Custom prompt:</p> <textarea bind:value={customPrompt} class="border-2 border-black-300 w-[350px] h-[100px]"> </textarea> <br />
    <button class="p-2 bg-blue-300 " onclick={b}>Submit</button>
    <p>LLM result: {text}</p>
</div>

