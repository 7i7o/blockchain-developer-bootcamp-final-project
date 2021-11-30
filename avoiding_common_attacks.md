# Avoiding Common Attacks


## 1. Proper Use of require, assert and revert (SWC-110)

All the `require` calls are made to validate input. `assert` and `revert` are not used in the project.


## 2. Use Modifiers only for validations (SWC-107)

All the `modifier` are used for validation of data. They are all using a `require` and running the function if it passes.


## 3. Built-In Variable Names (SWC-119)

All the function names have distinctive names, not resembling any variable that could be shadowed


## 4. tx.origin Authentication (SWC-115)

The contract doesn't use tx.origin in any of the code. It uses msg.sender instead.