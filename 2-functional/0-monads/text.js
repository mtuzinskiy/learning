// Hello everybody and welcome to my introductionary training dedicated to FP.
//
// You all know about the hype around the functional programming recently,  especially in web UI development.
// Started by React and especially Redux, popularized by enthusiasts such as Dan Abramov and others.
// In Angular we have RxJS which is FRP, and FRP is based of course on FP.
// In Vue, we have functional components. And so on.

// Actually, the paradigm appeared more than 80 years ago, long before OOP and even computers existed.
// The topic is broad and complex, it's intermingled with mathematics, and you can go very deep exploring it...

// But today I want to provide you with a solid foundation to get started. 
// Knowing this, you'll understand everything else, and will be able 
//
// Before we start, let get to know each other.

// My name is Markel, I'm an application architect in SoftServe. 
// I've been working in Web UI development for over 14 years now, involving various technologies, such as
// Java / J2ME, GWT, Android, Flash / Flex, PHP, Scala, Clojure / Clojurescript, Hybrid mobile apps and of course JS.

// In Javascript, I went all the way along with the history of SPA development trends:
// Prototype → Dojo → YUI → jQuery → ExtJS → GWT → Backbone → Knockout → Angular / React

// Now I'd like to know a little bit more about the audience. I've prepared the poll...

// 10 min

42;

var half = x => x / 2;
var plus1 = x => x + 1;

half(42);
plus1(42);

// (A word about var, let and const)

plus1(half(42));

var half_o_plus1 = x => plus1(half(x));

https://en.wikipedia.org/wiki/Function_composition

// (image with ovals and arrows)

https://en.wikipedia.org/wiki/Category_theory

// (draw)

// If you think about it, that's what we do in programming all the time:
// There's an input, such as the function argument or user input, then some transformation, and then the output: 
// either a return value or HTML / DOM.
// And then the cycle continues. But we always have this pattern.

// The "transformation" in between the input and output can be either one function, 
// or a combination (composition) of functions.
// That's the essence of what we do in programming / software development: we compose functions!  (draw cycle)

var negate = x => -1 * x;
var half_o_plus1_o_negate = x => negate(plus1(half(x)));
half_o_plus1_o_negate(42);

var half_o_plus1_o_negate = _.compose(negate, plus1, half);
half_o_plus1_o_Negate(42);

var half_o_plus1_o_negate = _.pipe(half, plus1, negate);

// The word "pipe" may be familiar to you. First of all, it's used in UNIX systems to compose the commands:

sudo iwlist wlan0 scan | grep Frequency | sort | uniq -c | sort -n

// 30 min

// But for the composition to work as we expect, the functions need to to be PURE, that is, without side effects.

https://en.wikipedia.org/wiki/Pure_function

// (all previous functions were pure)

// Ok now let's move on to more serious examples.


var userId = 42;
userId -> url -> HTTPRequest -> HTTPResponse -> json -> email
===
userId -> email


var getUrl = userId => `https://reqres.in/api/users/${userId}`;

// Now, url -> response

function httpGet(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => { 
    xmlHttp.readyState == 4 && 
    xmlHttp.status == 200 &&
      callback(xmlHttp.responseText);
  }
  xmlHttp.open('GET', url, true); // true for asynchronous 
  xmlHttp.send(null);
}

let email;
_.pipe(getUrl, httpGet); // what to do with callback???

// We could make it like this:

const httpGet = callback => url => {

_.pipe(getUrl, httpGet(response => ...)); // but the chain breaks here. You can't compose it further!
// The callback hell starts


// Smart guys who invented FP almost a century ago thought about this.  They said: let's add a notion of the Context.
// The Value is not just a Value, it's always in certain Context.
https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
// (scroll down)
// We have a Value in a Box, perfectly safe. Then if we want to do something with it (transform it), we open the Box,
// apply the function, and close the result in another Box of same kind.
// We call it "mapping": to "map" the Value.
// And the Values with Contexts, that can be mapped over, are called Functors:
https://en.wikipedia.org/wiki/Functor

// Functor: Value + Context  (in a Box). 
// What kind of Context it could be?
// What kind of Boxes we can think of?
// Imagine a box that has multiple sub-sections, which are numbered by index. You can map every value by function, 
// simultaneously, and produce a new Box of same kind.
// Sounds familiar, right? It's Arrays.
// Yes, Arrays are Functors (kinda)
https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
// (scroll down to arrays)

[1, 2, 3].map(x => x + 1);
[].map(x => x + 1);

x => [x]
  .map(half)
  .map(plus1)
  .map(negate)[0];

// Anything that can be "mapped" is a Functor.
// Let's make our own Functor!
var F = v => ({
  map: fn => F(fn(v))
});

(42).map(x => x);
// Note that it's "closed" in it's context. I can't get the value out directly, I can only map (and it makes sense, 
// because the Value is always in certain Context).

(42)
  .map(x => x)
  .map(x => console.log(x));

// 1h

// Let's expand just a little bit more on this...
// But what if I want to change the Context?
// I want to open the Box, get the value out, transform it, but then take ANOTHER kind of box and put it there.
// This can be done with Monads. Monads are Functors that can be "flatten": unwrapped from the Context 
// (but then wrapped back into different Context).
// This operation is called "flatMap": "flatten" and then "map".
// I know that it's too much of boring information,  but bear with me, now it's going to get interesting.

// Let's make our own Monad to illustrate the idea!
var M = v => ({
  map: fn => M(fn(v)),
  flatMap: fn => fn(v)
});

M(42)
  .map(x => x + 1)
  .flatMap(x => [x]) // Swapping on other, completely different Monad (Context "box")
  .map(x => x / 2)
  .filter(x => 21);

// Arrays are Monads (kinda)!
// Let's play a little bit with flatMap() for Arrays:
[[1], [2], [3]].flatMap(x => x);
// Can I unwrap it totally, to be 1, 2, 3? NO. The Context is always present.
[1, 2, 3].flatMap(x => [x, x, x]);

// NOW...
// Map and FlatMap give us the power to compose functions that operate on values in different contexts!
// We can compose functions to transform the Values in different Contexts

// Let's take a look at another useful Monad: a Promise. What's the Context here? 
// The value is not accessible right away, but will be available in the future.
// That's why in some other languages the Promises are called Futures.
// Let's get back to our example with the email, and see how the Promise Monad can help us there:
var getUrl = userId => `https://reqres.in/api/users/${userId}`;
var fetchUrl = url => fetch(url);
var toJson = data => data.json();
var getEmail = user => user.data.email;

var getEmailByUserId = userId => Promise
  .resolve(userId) // 'lift up' the value in Monad Context. Reverse to 'flatten'.
  .then(getUrl)
  .then(fetchUrl) // flatMap / swap on another Promise
  .then(toJson) // again, flatMap / swap on another Promise
  .then(getEmail)
  .catch(e => 'Email unavaliable');

getEmailByUserId(2).then(console.log);
// Notice how flatMap() magically applies!
// On tech interviews...

// One note about partially applied functions and curry.
// Let's imagine that we have a user list loaded from the backend:
var getUsers = companyId => fetch(...)
  .then(users => ...);
// And we want to deserialize it, by converting every user record in more convenient object, 
// leaving only what we need on frontend side:
var getUsers = companyId => fetch(...)
  .then(users => _.map(users, user => ({
    id: user.id,
    name: user.name
  })));
// Doesn't it look ugly and unreadable? 
// Imagine more operators in this chain (functions in this composition), like filter:
var getUsers = companyId => fetch(...)
  .then(users => _.map(users, user => ({
    id: user.id,
    name: user.name,
    active: user.active
  })))
  .then(usersVm => _.filter(usersVm, user => user.active));
// And other operators:
https://lodash.com/docs/4.17.15
// The problem here is that the collection always goes first in the argument list, 
// which makes the composition literally cumbersome. What if we could do this:
var getUsers = companyId => fetch(`https://.../companyId`)
  .then(map(user => ({
    id: user.id,
    name: user.name,
    active: user.active
  })))
  .then(filter(user => user.active));
// You can see that the users array itself disappears. I kinda "pre-initialize" the functions with the handlers, 
// and then the array is passed implicitly.
// I know that the server returns a list of users, and I see only what interests me: 
// the transformation of this list, step by step, as on the conveyor belt. (show image)
// Again, this makes the composition extremely readable and self-explanatory, 
// as a well written prose (or even poem?)  (read it)
// How to achieve this?
// In Javascript, functions are "first-class citizens", which means that I can do this:
var map = handler => array => array.map(handler);
map(x => 'A')([1, 2, 3]);

var filter = handler => array => array.filter(handler);
_.pipe(map(x => 'A'), filter(x => x === 'B'))([1, 2, 3]);

var composed = _.pipe(map(x => 'A'), filter(x => x === 'B'))
composed([1, 2, 3]);

// As you can see, it improves our composing experience. This "pre-initialization" of aruments is called currying.
// The function "waits" for all arguments to be provided:
var sum = _.reduce((a, b) => a + b);
sum(0, [1, 2, 3]);

var sumWith42 = sum(42);
sumWith42([1, 2, 3]);

// This allows me to have even MORE control over the function composition.
// It's also a powerful tool for making our functions reusable.
// It's so common in FP world, that in some languages ALL functions are curried by default.
// And in Javascript, there are numerous toolbelt libs that support this out of the box, such as Lodash!
// (show Lodash FP, Lodash original operators doc)
var getUsers = companyId => fetch(`https://.../companyId`)
  .then(map(pluck(['id', 'active', 'name'])))
  .then(filter({active: true}));


var deserializeUsers = map(pluck(['id', 'active', 'name']));
var onlyActive = filter({active: true});
var getUsers = companyId => fetch(`https://.../companyId`)
  .then(deserializeUsers)
  .then(onlyActive);

getUsers().then(users => doSomething());
// or
const users = await getUsers();

// Note that deserializeUsers, onlyActive are pure.
// Let's get back to our pure functions. Apart from being easy to reason about, test and less error-prone, 
// what else benefits do they have? It's optimization!
// Now, if we know that the functions that we compose are Pure, and same input will ALWAYS produce same output,
// we can just "memoize" them: execute the calculation only once, and then reuse the results.
// As an example, if we pretend that the user IDs will never change, we can memoize it:
var getEmailByUserIdMemoized = _.memoize(getEmailByUserId);
// That's how you can optimize your application instantly and out-of-the-box, if you work with Pure functions.

// For the sake of completeness, let's talk about immutability.
// Pure function should not mutate it's inputs, right?
var someState = {active: false};
var someFn = state => {
  state.active = true;
  // ...
  return 42;
};

var result = someFn(someState);
// How do you thik, is this function pure?

// Another common example:
var checked = 0;
items.map(item => {
  backend.check(item).then(result => {
    if (result) {
      checked++;
    }
  });
});

// Map should always return a value, and not make side effects!

var checked = Promise
  .all(items.map(backend.check))
  .then(filter(Boolean))
  .then(size);

// So, instead of mutating objects, we could return totally new objects from our pure functions,
// "breaking" the reference and making the external state mutation (side effect) impossible:
var someState = {active: false};
var someFn = state => {
  // ...
  return [42, {...state, active: true}];
};
var [result, newState] = someFn(someState);

// To denote that something's not going to be mutated, we use "const" keyword.
// Actually in daily work I use it in 90% of cases. It should be your default way to define a value.
// Again, we need immutability only to support the function composition.
// When I know that the function call doesn't mutate the external world, I can freely compose it with other functions.

// So! In Monads, there is no way to get the value OUT of the wrapping context.
// We can map it, we can log it, etc. but always inside a Monad's context.
// And that's the whole point! It makes the developer _think_ always in terms of current context!
// Monad guarantees that it's value is isolated, immutable and safe. 
// Side effects like errors are extracted out. It's just another context: 'there might be an error...'

// With pure function composition, our app starts to resemble the beautiful mathematic equation.
// I hope that you have this amazing feeling already: our code get closer and closer to mathematics.
// Ok let's move on.

// 1h 30m
