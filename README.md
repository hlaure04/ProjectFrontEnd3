# Project Title: FrontEnd

# Description
Developing a blockchain application that uses a smart contract with two to three specific functions.

# Getting Launched
- Launch the Remix IDE in a web browser.
- Generate a new file with a `.sol` extension, indicating the use of Solidity.
- Compile your contract by choosing the right compiler version.
- Engage with the functions of your contract by selecting the buttons that correspond to those functions.
- Review the results of your functions and examine the specifics of each transaction.

Code Snippet
    return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            })


Author:
Heleana V. Laure
8213709@ntc.edu.ph
