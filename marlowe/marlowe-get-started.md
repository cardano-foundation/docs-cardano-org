## Getting Started with the Marlowe Playground
There are three options that you can choose from when using the Marlowe Playground. You can write directly in Marlowe text, but also use the visual Blockly visual programming tool to create contracts by fitting together blocks that represent the different components. 

Or you can choose to use either the embedded Haskell or Javascript editors to help you describe Marlowe contracts more readably and succinctly if you prefer. Once a contract is written, you can analyse its behaviour, such as checking whether any payments made by the contract could conceivably fail. You can also step through how a contract will behave, simulating the actions of the participants,

### Writing Marlowe with Blockly 
You can write Marlowe code directly as Marlowe text, or alternatively use the Blockly visual interface to piece together the parts of the contract. This is a very useful tool for those users who may not have experience in programming editors, and want to build the contracts visually.


To use Blockly follow these steps:
1. Open the [Marlowe Playground](https://alpha.marlowe.iohkdev.io/#/).


2. Click Start coding and select Blockly from the menu.
You will see a window like this:

You can build contracts by adding components to the ‘contract’ block. You will see a list of options for forming a contract by clicking ‘contracts’ in the menu. 

Click Contracts and select a block. Drag it into the building pane and then fit it into the top-level slot. 
For example, this allows constructing a contract starting with `When` as its main construct.

Continue building a contract. To build a contract with ‘When’, it needs to include one or more actions that trigger the contract. These can be chosen from the "Actions" menu item.

For example, select a ‘deposit’ action and fit it into the first gap in the contract that you are building. 

Next, you will need to insert information about:
 - who is making the deposit (a party)
 - the value and currency (token) of the deposit
 - whose account it should be deposited to (a recipient).

You can add other actions. For this, choose actions, add them, and fill out information. Respective action will require different types of information.  Add the ‘close’ tab after ‘continue as’ so that the contract closes after making the deposit. 
Finally, when all actions are inserted and conditions are added, you can complete your contract by adding a ‘close’ tab to the main contract. This shows how the contract should behave in case the deposit is not made before the specified timeout. 



