# 🚀SpaceViz

A modular suite of open-source tools and scripts developed by the Space Research Group for Monte Carlo molecular simulations and materials research under polarizable models.

---

## 📦 Repository Overview

This organization contains the following projects:

- **`mpmc` (C, GPL‑3.0)** — High-performance Monte Carlo molecular simulation engine for materials with polarizable models. Ideal for research in computational materials science. :contentReference[oaicite:1]{index=1}  
- **`mmc` (Python, MIT)** — A complementary Python wrapper/toolkit around `mpmc` for scripting, analysis, and automation tasks. :contentReference[oaicite:2]{index=2}  
- **`common-scripts` (Shell)** — Reusable submission and input scripting to streamline common HPC workflows. :contentReference[oaicite:3]{index=3}  
- **`phast-forcefields` (Python, MIT)** — A collection of PHAST2 forcefield definitions in `.offxml` format. :contentReference[oaicite:4]{index=4}  
- **`space-group-environment` (Shell, GPL‑3.0)** — Environment setup and helper scripts tailored for the space group workflow and dependencies. :contentReference[oaicite:5]{index=5}  
- **`smirnoff-plugins` (Python, MIT)** — Extensions for custom force-field functional forms using OpenFF/SMIRNOFF. :contentReference[oaicite:6]{index=6}  
- **`mpmc_testing` (Python, GPL‑3.0)** — Unit tests and regression suites ensuring engine reliability. :contentReference[oaicite:7]{index=7}  

---

## 🔍 Key Features

- **Cross-language workflows**: Core in C (`mpmc`) with Python and shell-level tooling to simplify use.
- **Production-tested forcefields**: Ready-to-use PHAST2 `.offxml` definitions for seamless integration.
- **HPC-ready scripting**: Templates to submit jobs, configure environments, and batch run simulations.
- **Extensible design**: Plugin architecture via SMIRNOFF-compatible modules.
- **Testing-first development**: Continuous testing suite included in `mpmc_testing`.

---

## 🛠 Getting Started

### 1. Clone the repo

\`\`\`bash
git clone https://github.com/stephenrodrick/space-research.git
cd space-research
\`\`\``


### 2. Install dependencies

* **C version (`mpmc`)**

  \`\`\`bash
  cd mpmc
  ./configure && make && sudo make install
  \`\`\`

* **Python modules**

  \`\`\`bash
  pip install -r mmc/requirements.txt
  pip install phast-forcefields smirnoff-plugins
  \`\`\`

* **Shell tools**

  \`\`\`bash
  cd common-scripts
  chmod +x *.sh
  \`\`\`

### 3. Run a demo

\`\`\`bash
# C binary usage
mpmc --input examples/sample.inp --ff phast-forcefields/example.offxml

# Python wrapper example
python mmc/run_simulation.py --config examples/config.yaml
\`\`\`

> *Replace paths with your local environment setup.*

---

## 📁 Repository Structure

\`\`\`
/
├── mpmc/                     # Core C-based Monte Carlo engine
├── mmc/                      # Python API and automation scripts
├── common-scripts/           # HPC submission & setup scripts
├── phast-forcefields/        # PHAST2 forcefield XML files
├── space-group-environment/  # Shell environment setup and utilities
├── smirnoff-plugins/         # Force-field plugin modules
└── mpmc_testing/             # Test suite for C and Python modules
\`\`\`

---

## ✅ Running Tests

Quick test suite execution:

\`\`\`bash
cd mpmc_testing
pytest
\`\`\`

Ensure both C engine and Python interfaces are verified.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project and create a feature branch.
2. Write tests for new features or fixes.
3. Ensure code passes `pytest` (for Python) and C build/tests.
4. Open a pull request with a detailed description and motivation.

---

## 📄 License

* **`mpmc`, `space-group-environment`, `mpmc_testing`**: GPL‑3.0
* **`mmc`, `phast-forcefields`, `smirnoff-plugins`**: MIT

Refer to each module’s LICENSE file for full terms.

---

## 📞 Contact & Support

For issues, questions, or collaboration inquiries, please open a GitHub issue or contact:

* **Stephen Rodrick** · Space Research Group Lead
* Email-stephenrodrick17@gmail.com

---

## 🔗 Related Projects & References

* See also: openforcefield/smirnoff‑plugins — provides inspiration for plugin architecture.
* Leverage HPC environment scripts in `common-scripts` for efficient scheduling.

---
