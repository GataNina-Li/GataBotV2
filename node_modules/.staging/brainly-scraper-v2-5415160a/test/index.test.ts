import Brainly from "../index";

(async() => {
 const data = await Brainly("1+1", 5, "id");
 console.log(data);
})();