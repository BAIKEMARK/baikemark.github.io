export default {
  fetch(request) {
    const incoming = new URL(request.url);
    const destination = new URL(`https://blog.markbai.com${incoming.pathname}`);
    destination.search = incoming.search;

    return Response.redirect(destination.toString(), 301);
  },
};
