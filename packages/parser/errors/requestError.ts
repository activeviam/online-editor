export class RequestError extends Error {
  constructor(missingAttributes: string[]) {
    const message = `The request body does not contain the following attribute(s): \n- ${missingAttributes.join(
      "\n- ",
    )}`;
    console.log(message);

    super(message);
  }
}
