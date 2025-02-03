const BorderImage = ({ color }: { color: string }) => {
  const path =
    "<path d='M2 2H4V4H2V2ZM4 0H6V2H4V0ZM10 4H12V6H10V4ZM0 4H2V6H0V4ZM6 0H8V2H6V0ZM8 2H10V4H8V2ZM8 10V8H10V10H8ZM6 10H8V12H6V10ZM0 6H2V8H0V6ZM10 6H12V8H10V6ZM4 10H6V12H4V10ZM2 8H4V10H2V8ZM10 4V6V8V4ZM4 10H8H6H4Z'/>";
  return `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='${encodeURIComponent(
    color
  )}' >${path}</svg>`;
};

export default BorderImage;
