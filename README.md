# AI in Accounts Receivable

This repository contains the bachelor thesis project files for **Artificial Intelligence in Accounts Receivable**.

## Project Overview

The project presents an AI-enhanced Accounts Receivable prototype that demonstrates how Machine Learning, Natural Language Processing, and Robotic Process Automation concepts can support payment prediction, invoice prioritization, promise-to-pay tracking, dispute handling, reconciliation, dashboard monitoring, and audit trail tracking.

The prototype was created as a Design Science Research artifact to show how AI tools can be integrated into one connected Accounts Receivable workflow.

## Repository Structure

- `Documentation/`  
  Contains the final thesis PDF, the project report Word document, and related documentation.

- `Prototype_code/`  
  Contains the exported prototype code from Figma Make.

- `Diagrams_source_code/`  
  Contains the BPMN and use case diagram source files exported from diagrams.net/draw.io.

- `resources/`  
  Contains a note explaining that no external dataset was used.

## Prototype

The prototype was created using Figma Make.

Prototype link:  
https://www.figma.com/make/CJGjfYmdiBkoW3xCmdTOww/Extend-AR-AI-System-Prototype?fullscreen=1&t=jKU3c0lKo3Hfscxg-1&code-node-id=0-9

## Diagram Source Code

The BPMN and use case diagrams were created using diagrams.net/draw.io.

- `.xml` files are the exported diagram code.
- `.drawio` files are editable diagram source files.
- `.png` files are image versions for viewing.

## How to Run the Prototype Code

The prototype code was exported from Figma Make and is included in the `Prototype_code/` folder.

To run the prototype locally:

1. Make sure Node.js is installed on your device.
2. Download or clone this repository.
3. Open the `Prototype_code/` folder.
4. Open a terminal inside the `Prototype_code/` folder.
5. Install the required dependencies:

```bash
npm install
```

6. Run the prototype:

```bash
npm run dev
```

7. After running the command, the terminal will show a local link, such as:

```bash
http://localhost:5173
```

Open this link in the browser to view the prototype locally.

## Dependencies

The required dependencies are listed in the `package.json` file inside the `Prototype_code/` folder. They are installed automatically when running:

```bash
npm install
```

## Dataset / Resources

No external dataset was used in this project. The prototype uses sample/simulated Accounts Receivable data for demonstration purposes.

## Notes

- No real company financial data was used.
- The prototype is a thesis artifact and is not a production-ready system.
- The repository includes documentation, prototype code, diagram source code, and supporting resources.
