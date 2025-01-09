"use client";

import { Link } from "@tanstack/react-router";
import * as React from "react";
export function NotFound() {
  return (
    <div>
      <p>This is the notFoundComponent configured on root route</p>
      <Link to="/">Start Over</Link>
    </div>
  );
}
