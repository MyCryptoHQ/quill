import React from 'react';

export const AddAccount = () => (
  <>
    Private Key
    <br />
    <label>
      <input type="text" />
    </label>
    <br />
    <label>
      Persistence
      <input type="checkbox" />
    </label>
    <br />
    <input type="submit" value="Submit" />
  </>
);
