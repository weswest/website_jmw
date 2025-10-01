---
title: "Avoiding PPNR Model Mis-Specification from Spurious Correlation Failures"
date: 2016-03-01
featured: false
link: "/publications/1715659383619.pdf"
image: ""
description: "Documentation of a bug in the SAS PROC AUTOREG procedure where models with no serial correlation fail the Godfrey serial correlation test."
tags: ["PPNR", "SAS", "Statistics", "Technical"]
weight: 500
sitemap:
  weight: 0.6
---

**Publication:** Novantas Perspective (March 2016)

This article describes a bug in the SAS PROC AUTOREG procedure discovered during 2015 PPNR model development: models with no serial correlation fail the Godfrey serial correlation test when also performing certain stationarity tests (Philips Perron or KPSS).

**The Problem:**
Seemingly well-specified models passed Durbin-Watson but failed Godfrey with p-values < .0001, indicating rejection of the null hypothesis of no serial correlation with > 99.9999% confidence - a nonsensical result.

**The Resolution:**
Run the PROC AUTOREG statement twice: once testing Godfrey, and once testing for stationarity. The article includes sample code for validation documentation.

---

<embed src="/publications/1715659383619.pdf" type="application/pdf" width="100%" height="800px" />
