export const dynamic = 'force-dynamic'; // Ensures dynamic rendering for authentication

export async function GET(request) {
  const url = new URL(request.url);
  
  // Don't redirect if already going to a specific path
  if (url.pathname !== '/superuser' && url.pathname !== '/superuser/') {
    return new Response(null, { status: 200 });
  }
  
  // Only redirect the root superuser path
  return Response.redirect(new URL('/superuser/login', request.url));
}
