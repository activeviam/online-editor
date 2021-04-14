export const helloGrammar = `grammar hello;

root: HELLO ID;

HELLO: 'hello';
ID: [a-zA-Z]+;
WS: [ \\t\\r\\n] -> skip;
`;
