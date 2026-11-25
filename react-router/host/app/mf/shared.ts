import * as React from "react";
import * as ReactDOM from "react-dom";

// The host's own React, offered to remotes so both sides use one instance.
export const shared = {
  react: {
    version: React.version,
    lib: () => React,
    shareConfig: { singleton: true, requiredVersion: "^19.0.0" },
  },
  "react-dom": {
    version: ReactDOM.version,
    lib: () => ReactDOM,
    shareConfig: { singleton: true, requiredVersion: "^19.0.0" },
  },
};
