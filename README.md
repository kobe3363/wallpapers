# 🎨 Wallpaper Portal Automation Suite

![Playwright](https://img.shields.io/badge/Playwright-1.40+-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

A robust, high-performance automated regression suite designed for a digital content platform (Wallpapers & Ringtones). This framework focuses on critical user flows: **Search, Filtering, and Content Download**, with a strong emphasis on stability and resistance to "flakiness".

---

## 🚀 Key Features

### 🛡️ "Bulletproof" Stability Strategy
The suite employs advanced techniques to handle aggressive pop-ups, GDPR banners, and third-party scripts without slowing down the tests:
* **Network-Level Blocking:** Automatically aborts requests to tracking/ad services (Didomi, Htlbid, Pubads) before they reach the browser.
* **DOM Injection & Cleaning:** A custom fixture injects a background script that proactively removes overlay elements (`#didomi-host`) from the DOM every 50ms.
* **Zero-Interaction Handling:** Tests do not waste time clicking "Reject Cookies" – the banners are prevented from rendering entirely.

### 🧠 Smart Flakiness Handling
Specifically tuned for **Firefox** and **WebKit** rendering idiosyncrasies:
* **Hybrid Locators:** Uses a combination of `getByRole` and `getByText` to handle Accessibility Tree inconsistencies in Headless mode.
* **State-Aware Interactions:** Logic checks `data-state="closed"` attributes before attempting interactions to avoid "toggle wars".
* **Auto-Retry Assertions:** Utilizes Playwright's `expect.toPass()` pattern to gracefully handle UI animations and rendering delays.

### 🏗️ Modular Architecture
* **Page Object Model (POM):** Strict separation of selectors and test logic.
* **Modular Configuration:** Browser profiles (`Chrome`, `Firefox`, `Safari`) are decoupled into `playwright.browsers.ts` for cleaner config management.
* **Auto-Fixtures:** Setup logic runs automatically via `{ auto: true }` fixtures, keeping test files clean and readable.

---

## 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    ```bash
    npx playwright install
    ```

---

## 🏃‍♂️ Running Tests

The project includes several `npm` scripts for different testing scenarios:

### Standard Execution
Run all tests in Headless mode (Default):
```bash
npm run test

---

## 🧪 Test Workflow

The core regression scenario verifies the integration between category selection, search engine, filtering, and file download capabilities.

```mermaid
graph LR
    Start(Open Portal) --> Category[Select 'Wallpapers']
    Category --> Search[Search 'sunrise']
    Search --> Filter[Filter 'Free']
    Filter --> Download[Download 1st Image]
    Download --> Verify{File Saved?}
    
    Verify -- Yes --> Pass((Pass))
    Verify -- No --> Fail((Fail))

    style Fail fill:#ffcdd2,stroke:#c62828
    style Pass fill:#e8f5e9,stroke:#2e7d32
    style Verify fill:#e1f5fe,stroke:#0277bd

---

## 🚀 Installation & Usage

### Prerequisites
* **Java JDK 17**: Ensure `java -version` returns 17.
* **Browser**: Chrome, Firefox, or Edge.
* **Gradle**: Wrapper included (`./gradlew`).

### Execution Commands

**1. Default Run (Headed Chrome)**
```bash
./gradlew clean test
```
**2. Run Specific Test Groups Execute only tests tagged with specific groups (e.g., "regression" or "smoke"):**
```bash
./gradlew clean test -Dgroups=regression
```
**3. Sequential Debug Mode Disable parallelism for easier debugging:**
```bash
./gradlew clean test -Dserial=true
```
**4. View Reporting Generate and serve the interactive Allure report (History, Graphs, Screenshots):**
```bash
./gradlew allureServe
```

### Stability check (Flakiness)

To ensure the test suite is robust and free of flaky failures, verify stability by running the execution multiple times in a loop.

**Mac / Linux (Bash):**
```bash
for i in {1..10}; do 
    echo "=== Cycle $i ==="
    ./gradlew clean test --warning-mode none
    if [ $? -ne 0 ]; then echo "Test Failed on Cycle $i"; break; fi
done
```
**Windows (PowerShell):**
```powershell
1..10 | ForEach-Object { 
    Write-Host "=== Cycle $_ ==="
    .\gradlew clean test --warning-mode none
    if ($LASTEXITCODE -ne 0) { Write-Error "Test Failed on Cycle $_"; break } 
}
```

### Code Quality & Linting

To ensure the code follows **Google Java Style** standards and remains clean, run the static analysis tool before pushing code. This will generate a report in `build/reports/checkstyle/test.html` if issues are found.
```bash
./gradlew checkstyleTest
```

---

## ⚙️ Configuration

This project uses a combination of **System Properties** (for framework control) and the **[Owner API](http://owner.aeonbits.org/)** (for test data constants). Defaults are defined in `src/test/resources/config.properties`. You can override any setting via CLI arguments (`-Dkey=value`).

**Key Configuration Properties:**

| Property Key | Default | Description |
| :--- | :--- | :--- |
| `selenide.browser` | `chrome` | Target browser (`chrome`, `firefox`, `edge`) |
| `selenide.headless`| `false` | Run without UI (Recommended for CI) |
| `timeout` | `10000` | Global element wait time (ms) |
| `baseUrl` | `imdb.com` | Application Base URL |
| `serial` | `false` | If `true`, disables parallel execution |
| `groups` | *(all)* | Filter tests by group (e.g., `search`, `smoke`) |

**Example: Headless Firefox Run with Custom Timeout**
```bash
./gradlew clean test "-Dselenide.browser=firefox" "-Dselenide.headless=true" "-Dtimeout=15000"
```

---

## 🧱 Data Driven Testing (JSON)
Tests are decoupled from data using JSON files located in `src/test/resources/data/`. We use a **Dynamic DataProvider** strategy.

**Convention:** The @Test method name must match the JSON key in the data file.

Example (`searchData.json`):
```json
{
    "testSearchAndCastNavigation": {
        "searchTerm": "QA",
        "minCastMembers": 3
    }
}
```

---

## ⚡ Framework Capabilities

### 🛡️ Resilience & Anti-Bot Strategy
IMDb employs strict anti-bot measures. This framework mitigates detection via:
* **Smart Headless:** Custom `ChromeOptions` and User-Agent rotation to mimic real user traffic in CI environments.
* **Dynamic Waits:** Leveraging Selenide's built-in smart waits (`shouldBe(visible)`) rather than hard sleeps.

### ⚡ Dynamic Parallelism
The suite automatically optimizes execution speed based on the host environment.
* **Logic:** `Threads = Max(1, Available Processors / 2)`.
* **Strategy:** `parallel = 'methods'`. Tests run concurrently at the method level.

### 🧠 AI-Driven Diagnostics
When a test fails, the custom `AIFailureListener` captures the stack trace and the HTML DOM snapshot into `build/ai_prompts/` folder.

**Workflow:**
1. Test Fails.
2. Developer opens `build/ai_prompts/PROMPT_testName_timestamp.txt`.
3. Developer pastes content into an LLM (ChatGPT/Claude) to receive an immediate fix suggestion based on the DOM state.

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Language** | Java | 17 (LTS) | Core development language (Assignment Requirement) |
| **Build Tool** | Gradle | 8.x | Dependency management and build lifecycle |
| **Automation** | Selenide | 7.5.1 | Fluent wrapper around Selenium WebDriver |
| **Orchestration** | TestNG | 7.10.2 | Test runner and parallel execution management |
| **Config** | Owner API | 1.0.12 | Type-safe property management |
| **Reporting** | Allure | 2.29.0 | Interactive execution history and failure analysis |
| **Linting** | Checkstyle | 10.12.0 | Enforcing Google Java Style standards |
