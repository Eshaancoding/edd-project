// https://www.captaincodeman.com/how-to-await-firebase-auth-with-sveltekit#firebase-auth-state-needs-to-settle
// import type { PageServerLoad } from "./$types";
// import {auth, user as currentUser } from "$lib/firebase";
// import { get } from "svelte/store";

// console.log("hello from server outside");
// export async function load({ params }): Promise<PageServerLoad> {
// 	console.log("hello from server");
// 	await currentUser().known;

// 	// fetch and return data based on user
// 	let user;
// 	const unsubscribe = await currentUser().subscribe((value) => {
//         console.log("in subscribe", value, Date.now())
// 		user = value;
// 	});
// 	console.log("after sub", user);
//     console.log("currentUser", auth.currentUser)
// 	unsubscribe();
// 	return { user, hello: "waddup" };
// };
