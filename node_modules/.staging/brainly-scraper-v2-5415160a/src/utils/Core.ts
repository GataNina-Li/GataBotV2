import BrainlyError from "./BrainlyError";

    /**
    * Check variable value
    * @param {*} variable
     */

 function _required(variable: string | undefined | number) {
     if (variable == "" || variable == undefined) {
         throw new BrainlyError("Param can't be blank");
     }
 }

     /**
     * replacle all html syntax
     * @param {string} data
     * @param {string}
     */

 const clean = (data: string) => {
    const regex = /(<([^>]+)>)/ig;
    data = data.replace(/(<br?\s?\/>)/ig, ' \n');
    return data.replace(regex, "");
  };

  export {
      _required,
      clean
  };