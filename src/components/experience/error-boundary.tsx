"use client";

import { Component, type ReactNode } from "react";

export class ExperienceBoundary extends Component<{ children: ReactNode; name: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-3 border border-navy/15 p-10 text-center">
          <p className="font-serif text-2xl">The {this.props.name} could not load.</p>
          <button type="button" onClick={() => this.setState({ failed: false })} className="text-xs tracking-[0.18em] uppercase underline underline-offset-4">
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
