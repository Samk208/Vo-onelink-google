/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "react" {
  export * from "react";
}

declare module "react-dom" {
  export * from "react-dom";
}
