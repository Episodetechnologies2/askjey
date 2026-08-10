import { NextResponse } from "next/server";

export default function middleware() {
  return NextResponse.next();
}

// Disable matching to bypass auth middleware
export const config = {
  matcher: [],
};
