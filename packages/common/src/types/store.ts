import type { Slice, SliceCaseReducers } from '@reduxjs/toolkit';

export type SliceState<S extends Slice<unknown, SliceCaseReducers<unknown>>> = S extends Slice<
  infer State
>
  ? S extends Slice<State, SliceCaseReducers<State>, infer Name>
    ? {
        [key in Name]: State;
      }
    : never
  : never;
