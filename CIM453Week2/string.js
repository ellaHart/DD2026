// This is a comment in JavaScript
/* This is a multi-line comment
---
---
--
--
*/

//strings represent textual data using qoutes or back ticks "s" or 's' or `s`

let first = "Ella";
let last = 'Hartsell';

let fullName = first + ' ' + last; // concatenation
console.log(fullName); // Output: Ella Hartsell

//Using template literals for easier string interpolation
let fullNameTemplate = `The full name is: ${first} ${last}`;
console.log(fullNameTemplate); // Output: The full name is: Ella Hartsell

//length of string
console.log(`Length of fullName: ${fullName.length}`); // Output: Length of fullName: 13

//Convert to uppercase
console.log(fullName.toUpperCase()); // Output: ELLA HARTSELL

//Convert to lowercase
console.log(fullName.toLowerCase()); // Output: ella hartsell

//Trim whitespace
let spacedString = "   Hello World!   ";
console.log(spacedString.trim()); // Output: Hello World!  