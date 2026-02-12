// non-primitive data types - objects are used to store collections of data nad more complex entities

let person = {
    firstName: "Ella",
    lastName: "Hartsell",
    age: 20,
    address: {
        street: "123 Main St",
        city: "Coral Gables",
        zipCode: "1001"
    }
};

console.log(person);

console.log(person.firstName); // Output: Ella
console.log(person.address.city); // Output: Coral Gables

person.email = "eph42@miami.edu";
console.log(person);