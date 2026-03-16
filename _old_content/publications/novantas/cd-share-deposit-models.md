---
title: "Improving Usefulness of PPNR CCAR Stress Test Models: Adding 30+ Years of Rate Data"
date: 2016-09-01
link: "/publications/1715659497926.pdf"
image: ""
description: "Using industry CD-Share as a rate proxy to add decades of rate sensitivity to deposit models trained on ultra-low interest rate periods."
tags: ["PPNR", "CCAR", "Deposits", "Modeling"]
weight: 400
sitemap:
  weight: 0.8
---

**Publication:** Novantas Perspective (September 2016)
**Co-authors:** Jane Lim, Ryan Schulz

To address the data shortcoming that many banks lack sufficiently long internal monthly history covering multiple rate cycles, Novantas uses the time deposit share of total interest-bearing deposit balances ("CD-Share") as an independent industry variable in deposit balance models.

**Why CD-Share Works:**
- Strongly correlated with Treasury rates (serves as proxy for high vs. low rate environments)
- Industry data available back to early 1980s (multiple rate cycles)
- Conceptually appropriate for stress testing applications

**Applications:**
1. Capturing switching behavior between CDs and MMDAs
2. Modeling attractiveness of consumer interest-bearing DDAs
3. Understanding commercial DDA preferences
4. Relationship between operational and non-operational deposits

**Implementation:**
Banks build a CD-Share forecasting model using 40+ years of industry data, then incorporate CD-Share as a driver in bank-specific deposit models - effectively training models on multiple rate cycles even when internal data only covers 2007-present.

---

<embed src="/publications/1715659497926.pdf" type="application/pdf" width="100%" height="800px" />
