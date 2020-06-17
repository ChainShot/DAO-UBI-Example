function a(i = 0) {
  if(i === 10) {
    return;
  }
  b(i);
}

function b(i) {
  console.log(i);
  a(i + 1);
}
