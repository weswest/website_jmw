---
title: "The Price of Money — an interactive guide to Funds Transfer Pricing"
date: 2026-07-28
description: "A bank is two businesses wearing one P&L. A scroll-driven explainer on funds transfer pricing: the internal market that decides which half actually makes money."
dek: "A scroll-driven explainer on the internal price of money."
layout: "tools/single"
noindex: true
draftBanner: true
---

<!-- ================================================================
     HERO
     ================================================================ -->
<header class="hero">
  <p class="hero__kicker">Funds Transfer Pricing · an interactive explainer</p>
  <h1 class="hero__title">The Price of Money</h1>
  <p class="hero__dek">A bank is two businesses wearing one P&amp;L — one manufactures funding, the other consumes it. This is the internal market that decides which of them actually makes money.</p>
  <p class="hero__byline">Wes West · a scrolling story · about 25 minutes</p>
  <p class="hero__cue" aria-hidden="true">scroll<span>↓</span></p>
</header>

<!-- ================================================================
     CHAPTER 1 · THE TIMBER COMPANY  (full-bleed overlay scene)
     ================================================================ -->
<section class="scene scene--overlay" id="scene-mill" data-scene="mill" data-title="Ch. 1 · The Timber Company">
  <div class="scene__sticky"><div class="scene__viz" data-scene-viz="mill"></div></div>
  <div class="scene__steps">
    <div class="step" data-beat="meet">
      <div class="step__card">
        <p class="step__kicker">Chapter 1 · The Timber Company</p>
        <p>Meet <strong>Cascade Timber Co.</strong> One company, two arms. The logging arm fells trees and mills them into lumber. The building arm turns that lumber into houses and sells them. Every board the mill cuts goes straight to its own construction sites.</p>
      </div>
    </div>
    <div class="step" data-beat="one-pnl">
      <div class="step__card">
        <p>Last year the company cleared <strong>$12M</strong>. One consolidated P&amp;L, one profit number — and no way to tell which arm earned it. Is the mill excellent? Is the builder? Are both merely adequate?</p>
      </div>
    </div>
    <div class="step" data-beat="free-lumber">
      <div class="step__card">
        <p>Inside the company, lumber moves between the arms at no charge. So the builder's costs look tiny and its margin looks heroic — while the mill books costs, sells nothing, and looks like a $12M-a-year expense. Free inputs make one side a genius and the other a cost center. <strong>Neither is true.</strong></p>
      </div>
    </div>
    <div class="step" data-beat="market-price">
      <div class="step__card">
        <p>The fix costs nothing: <strong>stamp every board with its market price</strong> — what the builder would pay a third-party sawmill. No cash moves. The lumber is simply priced as it crosses.</p>
      </div>
    </div>
    <div class="step" data-beat="two-pnls">
      <div class="step__card">
        <p>Now each arm has an honest P&amp;L. The mill earns the market value of what it cuts, minus its costs: <strong>+$6M</strong>. The builder pays market price for lumber and keeps what its craft adds: <strong>+$6M</strong>. Same company, same $12M — but now you know where it comes from. Grow the mill or the builder? Sell lumber to outsiders? Every one of those questions just became answerable.</p>
      </div>
    </div>
    <div class="step" data-beat="bank">
      <div class="step__card">
        <p><strong>This is a bank.</strong> Deposits are the logging arm — they manufacture funding. Loans are the building arm — they consume it. And the internal price stamped on money as it crosses the balance sheet is called <dfn data-term="ftp">funds transfer pricing</dfn>. The rest of this story is how that price gets set.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================
     INTERLUDE 1 · The spine
     ================================================================ -->
<section class="prose">
  <h2>One question, asked over and over</h2>
  <p>Funds transfer pricing asks one question of every dollar on a bank's balance sheet: <em>what would it cost to replace this money in the wholesale market?</em> Every answer has two parts — a <strong>term</strong> (how long is this money really around?) and a <strong>price</strong> (what does money of that term cost?). Loans get charged the answer. Deposits get credited it. Treasury sits in the middle and absorbs what's left.</p>
  <p>The stakes are not academic. Banking is a thin-margin business run on an enormous balance sheet — a good year is a couple hundred basis points of true economic spread. Get the internal price of money wrong and you spend a decade rewarding the wrong desks, mispricing the products that fund you, and discovering the error only when rates move. In 2023, several banks learned what it costs to misjudge the duration of their assets and the stickiness of their deposits — the two numbers this entire story is about.</p>
  <p>Three ground rules before we start:</p>
  <div class="prose__cards">
    <div class="prose__card">
      <h3>Not the customer's rate</h3>
      <p>FTP is internal — between Treasury and the line of business. The borrower and the depositor never see it.</p>
    </div>
    <div class="prose__card">
      <h3>Not credit pricing</h3>
      <p>Whether the borrower repays is a different risk with a different price. Credit is layered separately, always.</p>
    </div>
    <div class="prose__card">
      <h3>Not actual funding cost</h3>
      <p>The benchmark is wholesale <em>replacement</em> cost. Deposits usually cost less than that — and the gap is precisely the franchise's value.</p>
    </div>
  </div>
  <p>The story has two halves. <strong>Part I is about term</strong> — pinning down how long every balance actually sticks around. Easy for a CD, harder for a mortgage, hardest for a checking account. <strong>Part II is about price</strong> — turning a term into a number. We start where every good model starts: the simplest case that can possibly work.</p>
</section>

<!-- ================================================================
     CHAPTER 2 · ONE LOAN, LIVED FORWARD  (workbench scene)
     ================================================================ -->
<section class="scene scene--side" id="scene-loan" data-scene="loan" data-title="Ch. 2 · One Loan, Lived Forward">
  <div class="scene__sticky"><div class="scene__viz" data-scene-viz="loan"></div></div>
  <div class="scene__steps">
    <div class="step step--long" data-beat="intro">
      <div class="step__card">
        <p class="step__kicker">Part I · Finding the term — Chapter 2</p>
        <h3>One loan, on its own</h3>
        <p>Here is the simplest asset in banking: $100,000, five years, 7% interest, principal due at the end — a <dfn data-term="balloon">balloon loan</dfn>. <strong>Scroll, and watch it live its life.</strong> The marker traces the months; the readout tracks the money. $7,000 a year, then the principal comes home.</p>
      </div>
    </div>
    <div class="step step--long" data-beat="findmoney">
      <div class="step__card">
        <h3>First, a detail that's easy to skip</h3>
        <p>To hand a borrower $100,000, the bank needs $100,000 — actual dollars, on hand, today. So before anything else it goes looking for someone with money they won't need for a while, and makes an offer: a five-year <dfn data-term="cd">CD</dfn> paying 4%. A deposit customer with $100,000 sitting idle says yes. Now the bank has the money — the borrower's loan <em>is</em> the depositor's savings, with a bank standing in between.</p>
      </div>
    </div>
    <div class="step step--long" data-beat="matched">
      <div class="step__card">
        <h3>Now fund it</h3>
        <p>Here's the whole business model in one morning. 9:01 a.m.: the bank locks the depositor into the five-year CD at 4%. 9:05 a.m.: it hands that same $100,000 to the borrower at 7%. The paperwork takes four minutes; the consequence runs five years — <strong>the bank pays $4,000 a year to earn $7,000 a year. $3,000 of net interest income, every year. Locked.</strong></p>
      </div>
    </div>
    <div class="step step--long" data-beat="shock">
      <div class="step__card">
        <h3>Prove it's locked</h3>
        <p>The income chart moves upstairs; the bottom panel now shows the rates themselves. Two years in, the market jumps 200 basis points — watch <dfn data-term="sofr">SOFR</dfn> leap while the loan's 7% and the CD's 4% don't so much as flinch. Both rates are contractual. New deals will price off the new market, but this pair's spread is untouchable. This is <strong>term matching</strong>.</p>
      </div>
    </div>
    <div class="step step--long" data-beat="floating">
      <div class="step__card">
        <h3>It works when nothing is fixed, too</h3>
        <p>Float the loan at SOFR&nbsp;+&nbsp;250 and fund it with floating money at SOFR&nbsp;−&nbsp;50. Now all three lines dance — and they dance <em>together</em>. The market dives, both legs dive with it, and the gap between them never budges from 300 basis points: the same $3,000 a year, in every rate environment. So the rule isn't "fix everything" —</p>
      </div>
    </div>
    <div class="step" data-beat="rule">
      <div class="step__card">
        <h3>— the rule is: match both</h3>
        <p><strong>Match the rate type, and match the term.</strong> Do both, and the spread you book on day one is the spread you keep, in every rate environment. Everything that goes wrong from here is one of those two matches breaking.</p>
      </div>
    </div>
    <div class="step step--xlong" data-beat="naive">
      <div class="step__card">
        <h3>So let's break one</h3>
        <p>Same loan, but now the borrower repays $20,000 at each year-end — and we lazily keep the single $100k CD. <strong>Scroll slowly.</strong> The gap opens: by the start of year four you're paying 4% on $100,000 of funding against just $40,000 of loan. Watch the income panel — <strong>NII goes negative in year four.</strong> Five-year total: $1,000, down from $15,000. The funding didn't change. The asset did.</p>
      </div>
    </div>
    <div class="step step--long" data-beat="ladder">
      <div class="step__card">
        <h3>The fix is a ladder</h3>
        <p>Five CDs of $20,000 each — one, two, three, four, and five years. Each matures exactly when its slice of the loan pays down. The funding staircase hugs the asset, and NII is positive every year: <strong>$9,000 total instead of $1,000.</strong></p>
      </div>
    </div>
    <div class="step" data-beat="ladder-rates">
      <div class="step__card">
        <h3>And the ladder is cheaper than it looks</h3>
        <p>The wholesale market pays less for shorter commitments — in this telling, 2% for one-year money, stepping up to 4% for five. Price each rung at its own tenor and total NII climbs to <strong>$11,000</strong>. The edge compounds across every loan on the book. Precision isn't just safer. It's paid.</p>
      </div>
    </div>
    <div class="step step--long" data-beat="zoom">
      <div class="step__card">
        <h3>Now stretch it to a mortgage</h3>
        <p>Same machine, bigger loan: a 30-year fixed at 7%. On paper its behavior is mathematically smooth — a level payment, principal retiring on a curve you could plot to the penny for the year 2056. <strong>Keep scrolling: the clock is zooming out, five years to thirty.</strong> That long, confident glide path is the <em>contract</em>.</p>
      </div>
    </div>
    <div class="step" data-beat="sell">
      <div class="step__card">
        <h3>The contract meets a moving truck</h3>
        <p>US mortgages can be prepaid without penalty, whenever, for any reason. So here is one actual borrower: pays the schedule for three years, gets a new job two states over, sells the house — and the balance snaps to zero at month 36. The contract said 2056. Life said Tuesday.</p>
      </div>
    </div>
    <div class="step" data-beat="lives">
      <div class="step__card">
        <h3>And nobody else follows the schedule either</h3>
        <p>One borrower pays a chunk down every December when the bonus lands. Another rounds up with every paycheck and shaves six years off. One refinances in year five; one sells in year nine. Every path is legal, penalty-free, and unknowable in advance — the same chaos you'd expect from any collection of human lives.</p>
      </div>
    </div>
    <div class="step step--xlong" data-beat="behavioral">
      <div class="step__card">
        <h3>Aggregate the chaos and a new curve appears</h3>
        <p>Pool ten thousand of those lives and average them. <strong>Keep scrolling:</strong> the spaghetti fades, and a single smooth line draws itself through the middle — a <strong>behavioral curve</strong> that runs far below the contractual one. This is the balance the bank will actually be funding. The contract is what the lawyers signed; the behavioral curve is what the money does.</p>
      </div>
    </div>
    <div class="step" data-beat="staircase">
      <div class="step__card">
        <h3>Fund the curve you expect, not the one you signed</h3>
        <p>Matching the behavioral curve takes 360 rungs — but the wholesale market doesn't quote a 177-month CD. The bank builds a staircase from the six tenors that do exist, keeping the steps <em>above</em> the curve. The shaded gap is funding the bank pays for but doesn't need. Long <dfn data-term="amortizing">amortizing</dfn> assets are wasteful to fund, and that waste is part of their true cost.</p>
      </div>
    </div>
    <div class="step" data-beat="term">
      <div class="step__card">
        <h3>So what <em>is</em> the term of a 30-year mortgage?</h3>
        <p>Not 30 years. On the behavioral curve, the average dollar of principal is outstanding for about <strong>7.6 years</strong> — the pool's weighted-average life. That single read is shorthand: a real desk <em>strips</em> the loan, pricing each month's expected runoff at its own tenor, exactly like the ladder. <strong>Term found: 7.6 years.</strong> Hold onto it; Part II will price it. But first — that behavioral curve was drawn assuming the future stays polite.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================
     CHAPTER 3 · THE OPTION YOU SOLD  (interactive rate slider)
     ================================================================ -->
<section class="scene scene--side" id="scene-option" data-scene="option" data-title="Ch. 3 · The Option You Sold">
  <div class="scene__sticky"><div class="scene__viz" data-scene-viz="option"></div></div>
  <div class="scene__steps">
    <div class="step" data-beat="meet">
      <div class="step__card">
        <p class="step__kicker">Part I · Finding the term — Chapter 3</p>
        <h3>7.6 years — assuming the world holds still</h3>
        <p>That behavioral curve is not a fact — it's a forecast: a modeled, expected average over a whole range of future rate paths, none of which have happened yet. And one variable dominates all of them: <strong>where mortgage rates go next</strong>. This chart has a dial for exactly that. <strong>Grab the slider under the chart — or keep scrolling and the story will drive it.</strong></p>
      </div>
    </div>
    <div class="step" data-beat="falls">
      <div class="step__card">
        <h3>Rates fall — the pool evaporates</h3>
        <p>Drop market rates 150 basis points and refinancing becomes free money: our 7% borrowers can walk across the street, sign at 5.5%, and hand back the balance. The behavioral curve caves in and the average life collapses toward <strong>six years</strong> — shove the slider to the floor and it touches five and a half. The asset the bank funded for 7.6 years is leaving early — right when reinvesting the cash pays less than ever.</p>
      </div>
    </div>
    <div class="step" data-beat="rises">
      <div class="step__card">
        <h3>Rates rise — and almost nothing happens</h3>
        <p>Push rates the other way and nobody refinances a 7% mortgage into an 8.5% one — only the moving trucks still prepay. But notice the number: the average life stretches to barely <strong>eight years</strong>, not twelve. That lopsidedness is the whole story: <em>massive</em> contraction when rates fall, <em>modest</em> extension when they rise. The borrower wins in both directions.</p>
      </div>
    </div>
    <div class="step step--long" data-beat="penalty">
      <div class="step__card">
        <h3>A thought experiment: charge for the exit</h3>
        <p>Imagine a world where every mortgage carried a stiff prepayment penalty — and one bank offered applicants a deal: <em>pay a little extra each year, and prepay whenever you like, free.</em> Most borrowers would take it in a heartbeat. That add-on has a name — it's an <strong>option</strong> — and an entire branch of finance exists to price options. The math runs deep, but the intuition is one line: <strong>an option is worth more the more likely it is to be used.</strong> A meter just switched on under the chart.</p>
      </div>
    </div>
    <div class="step step--long" data-beat="optvalue">
      <div class="step__card">
        <h3>When would it be used? When rates fall</h3>
        <p>The slider drops again — but this time watch the meter, not the curve. With market rates 150 basis points lower, refinancing tempts every borrower in the pool, so the right to prepay is at its most valuable exactly here. Rates expected lower, option worth more. That one heuristic is most of what an option-pricing model is doing under the hood.</p>
      </div>
    </div>
    <div class="step" data-beat="price">
      <div class="step__card">
        <h3>Now the twist: that world isn't imaginary — it's inverted</h3>
        <p>In the United States, <strong>every bank offers the prepayment option</strong> — penalty-free repayment is baked into essentially every residential mortgage, priced at zero on the term sheet. But zero isn't its value. The option is still worth real money to the customer and still costs real money to the bank — and FTP is where that cost gets accounted for properly: a surcharge on the mortgage of <strong>about 35bps a year</strong> in this telling. File that number away: it resurfaces, line by line, in the ledger of Chapter 7.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================
     INTERLUDE 2 · Pivot to deposits
     ================================================================ -->
<section class="prose">
  <h2>The other half of the balance sheet has no contract at all</h2>
  <p>Everything in the last two chapters had a schedule — even the mortgage's behavior was a modification of one. A checking account is the opposite: the customer can take every dollar back tomorrow at 9:01 a.m. And yet checking is the most stable funding a bank has. Roughly seventy percent of a typical US bank's funding is <dfn data-term="nmd">deposits with no maturity date</dfn>.</p>
  <p>Money that is contractually overnight and behaviorally long — resolving that paradox is the deposit franchise's entire value. It is also the hardest term-finding problem in the building.</p>
</section>

<!-- ================================================================
     CHAPTER 4 · MANUFACTURING A TERM  (deposits scene)
     ================================================================ -->
<section class="scene scene--side" id="scene-deposits" data-scene="deposits" data-title="Ch. 4 · Manufacturing a Term">
  <div class="scene__sticky"><div class="scene__viz" data-scene-viz="deposits"></div></div>
  <div class="scene__steps">
    <div class="step" data-beat="one">
      <div class="step__card">
        <p class="step__kicker">Part I · Finding the term — Chapter 4</p>
        <h3>One account, seven years</h3>
        <p>Here is a single checking account: it grows, spikes with a bonus, halves for a kitchen remodel, and one day walks out entirely. No schedule, no maturity, no contract. You cannot fund against this.</p>
      </div>
    </div>
    <div class="step step--xlong" data-beat="thirty">
      <div class="step__card">
        <h3>Thirty accounts, thirty stories</h3>
        <p>More accounts don't obviously help. <strong>Keep scrolling:</strong> each account's history draws itself in turn — a steady saver, a boat buyer, a yield chaser — thirty different lives, one after another. Individually, deposits are noise.</p>
      </div>
    </div>
    <div class="step" data-beat="average">
      <div class="step__card">
        <h3>Stop watching individuals</h3>
        <p>Watch the group instead: every account opened in the same quarter, tracked as one block — a <dfn data-term="cohort">cohort</dfn>. Thirty lives average into something with a visible shape.</p>
      </div>
    </div>
    <div class="step step--xlong" data-beat="lln">
      <div class="step__card">
        <h3>Scroll to add accounts</h3>
        <p>At ten, a pattern. At a hundred, a curve. At ten thousand, an engineering input. <strong>The law of large numbers converts customer chaos into a decay profile you can set a clock by.</strong></p>
      </div>
    </div>
    <div class="step" data-beat="shapes">
      <div class="step__card">
        <h3>Every product has a signature</h3>
        <p><dfn data-term="mmda">MMDA</dfn> money chases yield and decays fast — half gone in about 2.5 years. Savings holds on longer. And checking? Checking is so sticky it <em>never reaches</em> its half-life inside our seven-year window — 60% of the original balances are still sitting there at the end. Which raises an awkward question —</p>
      </div>
    </div>
    <div class="step step--xlong" data-beat="vintages">
      <div class="step__card">
        <h3>And the book renews itself</h3>
        <p><strong>Scroll to run ten years forward</strong> — this time on the savings book, half-life around 3.6 years. The deep-blue base is the back book: every account already open on day one, decaying exactly as its curve predicts. Each new color stacked on top is one year's <dfn data-term="vintage">vintage</dfn> of new accounts — and each starts decaying too, the moment it lands. Every individual layer shrinks. The total never moves. The stability isn't stickiness. It's predictable replacement.</p>
      </div>
    </div>
    <div class="step" data-beat="truncate">
      <div class="step__card">
        <h3>— when does checking money "end"?</h3>
        <p>Honest answer: the math says never. Project that tail forward and some balances outlive the model, the modeler, and the bank's core system. A life of "infinity" prices nothing — so the bank imposes a rule: <strong>everything still here at year 7 is called 7-year money.</strong> The wall is a policy choice, not physics. But once it's up, the life becomes computable: the 60% of balances surviving at the wall contribute 60% × 7 = <strong>4.2 years</strong> all by themselves, and counting the dollars that left earlier lifts the cohort's weighted-average life to about <strong>5.8 years</strong>. Without truncation, no defensible number. With it: a term.</p>
        <details class="step__foot"><summary>Seven years is a <u>convention</u>, not a law</summary><p>The 7-year wall is a common choice for the truncation horizon — but not the only one. Banks run 5-, 7-, and 10-year walls depending on product, philosophy, and how much history they trust, and some regulatory frameworks cap how long the assumption may run. Moving the wall moves the term, which moves the P&amp;L — which is why its placement gets argued about in committee.</p></details>
      </div>
    </div>
    <div class="step" data-beat="contract">
      <div class="step__card">
        <h3>A statistical contract can be treated like a contract</h3>
        <p>A 10,000-account cohort with a truncated weighted-average life of 5.8 years can be <em>planned</em> as 5.8-year money — the ladder from Chapter 2 applies, rung for rung, out to the wall. Treated like a contract, not guaranteed by one: it's a modeling stance, and the model can always be wrong. (A real desk strips it, pricing each year's expected runoff at its own tenor; the single 5.8 is the honest shorthand.) <strong>Term found: 5.8 years</strong> — for money the customer could take back tomorrow.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================
     INTERLUDE 3 · Part II turn — the notional confession
     ================================================================ -->
<section class="prose">
  <h2>Part II — nobody actually buys the CDs</h2>
  <p>Time for a confession. Through all of Part I, the bank was "buying CDs" to fund one loan. No bank funds loan-by-loan — the ladder was a measuring stick, not a shopping list. FTP charges each loan what its matched funding <em>would have</em> cost, reads the answer off a curve, and lets Treasury manage the actual balance sheet in aggregate — where most of the mismatches net against each other before anyone touches a market.</p>
  <p>One loan's charge, one deposit's credit, no instruments purchased. Which raises the operative question: <strong>which curve?</strong></p>
</section>

<!-- ================================================================
     CHAPTER 4 · THE PRICE OF TIME  (curve scene)
     ================================================================ -->
<section class="scene scene--side" id="scene-curve" data-scene="curve" data-title="Ch. 5 · The Price of Time">
  <div class="scene__sticky"><div class="scene__viz" data-scene-viz="curve"></div></div>
  <div class="scene__steps">
    <div class="step" data-beat="tsy">
      <div class="step__card">
        <p class="step__kicker">Part II · Pricing the term — Chapter 5</p>
        <h3>The price of time, in three layers</h3>
        <p>Here is the destination up front: <strong>FTP is the aggregation of a base rate, a term liquidity premium, and a funding source premium.</strong> This chapter builds those layers one at a time — starting at the floor. US Treasuries: the risk-free rate at every maturity. Note the slope — even risk-free money costs more the longer it's locked away.</p>
      </div>
    </div>
    <div class="step" data-beat="sofr">
      <div class="step__card">
        <h3>Banks measure against a curve of their own</h3>
        <p>The banking system's benchmark is <dfn data-term="sofr">SOFR</dfn> — a rate banks built for themselves. Overlay term SOFR on the Treasuries and notice something odd about it: only the <em>overnight</em> point is a real, contractual transaction. Every point to its right is a traded forecast — the market's bet on where overnight money will average over that horizon.</p>
        <details class="step__foot"><summary>Why banks <u>invented</u> their own benchmark</summary><p>The previous benchmark, LIBOR, was a survey — banks self-reporting what they'd charge each other — and it proved manipulable. SOFR replaced it: computed from actual overnight repo transactions, roughly a trillion dollars of real trades a day, hard to game. Term SOFR is then derived from futures on that overnight rate — which is exactly why everything past the overnight point is a forecast, not a contract.</p></details>
      </div>
    </div>
    <div class="step" data-beat="decompose">
      <div class="step__card">
        <h3>Two of the three layers, already visible</h3>
        <p>Circle the one contractual point — overnight SOFR, 3.40% — and flatline it across the chart: that dotted line is the <strong>base rate</strong>. Everything term SOFR charges <em>above</em> the line is the <dfn data-term="termLiquidity">term liquidity premium</dfn> — the price of locking money up, growing with tenor. Base rate, plus the term premium on top of it.</p>
      </div>
    </div>
    <div class="step step--xlong" data-beat="fed">
      <div class="step__card">
        <h3>A breather: the curve is a mood ring</h3>
        <p>Before the last layer, watch what moves this thing. Term SOFR is a forecast, and the forecaster is the market watching the Fed. <strong>Scroll:</strong> when hikes are expected, the whole curve steepens and the premium gapes wide; when cuts are priced in, it flattens and inverts — long money briefly <em>cheaper</em> than overnight. Same bank, same day. The shape is pure expectation.</p>
      </div>
    </div>
    <div class="step step--long" data-beat="funding">
      <div class="step__card">
        <h3>One problem: a bank can't actually fund at SOFR</h3>
        <p>Term SOFR is a benchmark, not a store. When a bank needs real term money it goes to real counters — <dfn data-term="brokered">brokered CDs</dfn> and <dfn data-term="fhlb">FHLB advances</dfn> — and both charge more than term SOFR, by different amounts at different tenors. <strong>Drag the slider</strong> to blend the two into the bank's assumed funding curve. The gap between that blend and term SOFR is the third layer: the <strong>funding source premium</strong>. And notice what the slider just proved — two banks facing the same market can carry different curves, because the mix is a management choice.</p>
      </div>
    </div>
    <div class="step step--xlong" data-beat="stack">
      <div class="step__card">
        <h3>Base + term premium + funding premium = FTP</h3>
        <p>Stack all three and you have the bank's internal price list for time. <strong>Scroll to sweep the read line</strong> and watch the decomposition at every tenor — at five years: 3.40 base + 0.55 term liquidity + 0.28 funding = <strong>4.23%</strong>. Feed in a term, out comes a price. Everything before this was about earning the right to do the lookup.</p>
      </div>
    </div>
    <div class="step" data-beat="reads">
      <div class="step__card">
        <h3>Now cash in Part I</h3>
        <p>The mortgage's 7.6-year behavioral term reads <strong>4.42%</strong> — its FTP charge, before the ~35bps prepay-option surcharge from Chapter 3 goes on top. The checking cohort's 5.8-year term reads <strong>4.29%</strong> — its credit. Same curve, both directions: a market-driven number, shaped at the edges by each bank's own choices. But the deposit read comes with a twist —</p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================
     CHAPTER 5 · THE BETA TWIST  (beta scene)
     ================================================================ -->
<section class="scene scene--side" id="scene-beta" data-scene="beta" data-title="Ch. 6 · The Beta Twist">
  <div class="scene__sticky"><div class="scene__viz" data-scene-viz="beta"></div></div>
  <div class="scene__steps">
    <div class="step" data-beat="fed">
      <div class="step__card">
        <p class="step__kicker">Part II · Pricing the term — Chapter 6</p>
        <h3>— deposit rates aren't static</h3>
        <p>When the Fed hiked 425 basis points, checking rates crept up about 85. The ratio — how much of a market move gets passed through to the customer — is the deposit <dfn data-term="beta">beta</dfn>. Checking: roughly 0.20.</p>
      </div>
    </div>
    <div class="step" data-beat="spectrum">
      <div class="step__card">
        <h3>Every product sits on a spectrum</h3>
        <p>Checking barely moves; high-yield online savings tracks the market almost tick for tick; a term CD <em>is</em> the market. The sticky fraction is franchise value — funding that doesn't reprice when the world does.</p>
      </div>
    </div>
    <div class="step" data-beat="split">
      <div class="step__card">
        <h3>So the credit splits in two</h3>
        <p>Our β=0.20 checking cohort is treated as 80% term funding — credited at the 5.8-year point of the FTP curve, 4.29%, locked at origination — and 20% overnight money at the curve's short end, 3.40%, floating with the market. Blended credit: <strong>3.43 + 0.68 = 4.11%</strong>. When the Fed moves, the floating credit and the rate you pay move together, and <strong>the spread holds</strong>. Forecast beta right and the desk is immune to the cycle. Forecast it wrong and the error lands on you — which is exactly the incentive a measurement system should create.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================
     CHAPTER 6 · THE RECKONING  (ledger scene)
     ================================================================ -->
<section class="scene scene--side" id="scene-ledger" data-scene="ledger" data-title="Ch. 7 · The Reckoning">
  <div class="scene__sticky"><div class="scene__viz" data-scene-viz="ledger"></div></div>
  <div class="scene__steps">
    <div class="step" data-beat="asset">
      <div class="step__card">
        <p class="step__kicker">Part II · Pricing the term — Chapter 7</p>
        <h3>Settle the scores: the loan</h3>
        <p>The five-year loan from Chapter 2: the borrower pays 7.00%, the five-year FTP charge is 4.23%. <strong>Gross spread: 2.77%</strong> — and that number is already rate-proof. Treasury owns the mismatch now.</p>
      </div>
    </div>
    <div class="step" data-beat="deposit">
      <div class="step__card">
        <h3>Same arithmetic, other direction</h3>
        <p>The checking cohort from Chapter 4: a blended credit of 4.11% — 80% of it 5.8-year money, 20% overnight — against 0.60% actually paid. <strong>Franchise spread: 3.51%.</strong> Yes, it's bigger than the loan's — at most good banks the deposit franchise <em>is</em> the bigger business. Measured, not asserted.</p>
      </div>
    </div>
    <div class="step" data-beat="refine">
      <div class="step__card">
        <h3>Then the honest deductions</h3>
        <p>Expected credit losses: −0.50%. The equity the regulator requires the loan to consume: −0.60%. And the options the bank wrote — the mortgage prepayment right you priced in Chapter 3, promo-rate floors, HELOC standby — each charged to whoever wrote them. What survives on the loan is its <strong>franchise spread: 1.67%</strong> — the same yardstick the deposit desk just got measured by.</p>
      </div>
    </div>
    <div class="step" data-beat="full">
      <div class="step__card">
        <h3>The ledger FTP exists to produce</h3>
        <p>Every layer visible, every desk charged for exactly what it uses and credited for exactly what it creates. Banking's margins are thin — the point of FTP isn't to make them wider. <strong>It's to make them attributable.</strong></p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================
     INTERLUDE 4 · How FTP gets used
     ================================================================ -->
<section class="prose">
  <h2>What the number does on a Tuesday</h2>
  <p>Everything above is measurement. But nobody builds an internal market for the scenery — FTP earns its keep in the decisions it tips. And there's a standing assumption underneath all of them: this bank already originates well. FTP isn't triage for bad underwriting. It's the tiebreaker for a bank choosing at the margin — <em>which</em> loan, <em>which</em> deposit, <em>which</em> term to lean into next.</p>

  <h3>The mortgage desk gets a price grid</h3>
  <p>The mortgage product manager receives an FTP cost grid across terms — and it never quite matches what customers want to buy. The 30-year fixed is the most popular product in America and one of the most expensive entries on the grid; a 12-year loan is dramatically cheaper to fund and nearly invisible in the market. So the grid poses a genuinely strategic question: pay up to meet the demand that exists, or spend marketing dollars conjuring demand where the funding is cheap? FTP doesn't answer that. It turns the debate from taste into arithmetic.</p>

  <h3>A rate lock is a forward in a trench coat — wearing an option</h3>
  <p>Commercial borrowers ask for rate locks — a promise today about a loan that funds in ninety days. Decomposed, that promise is two instruments: a <em>forward</em> on the loan's rate, priced mechanically off today's curve (no forecast required — the forward rate is arithmetic), plus a <em>written option</em>, because the borrower can walk away and re-shop if rates drop before closing. The forward leg is cheap to hedge; the option leg is not free, and its price comes from volatility, not from anyone's opinion about where rates are headed. FTP is where both legs land on the deal sheet. Price the lock at zero and the lending team books wins that Treasury quietly pays for — the same option-shaped leak as Chapter 3's mortgage, three months at a time.</p>

  <h3>Beta is negotiated — and being wrong is expensive</h3>
  <p>The deposit credit runs on beta, and beta isn't observed — it's <em>agreed</em>, typically once a quarter or once a year, between the business and FP&amp;A. Assume your customers are more rate-sensitive than they really are, and when rates fall your FTP credit falls with the market while the rates you actually pay barely move: profitability destroyed by an assumption. Assume too little sensitivity and the same trap springs in the other direction when rates rise. There is no hedge for a wrong beta. Your best insulation is to be right — which is why the negotiation deserves data, not optimism.</p>

  <p>The pattern is the same in every case: FTP doesn't make the call. It makes sure the call is made with the cost of money on the table — and that whoever makes it owns the consequences.</p>
</section>

<!-- ================================================================
     CHAPTER 7 · BACK TO THE TIMBER COMPANY  (overlay close)
     ================================================================ -->
<section class="scene scene--overlay" id="scene-close" data-scene="close" data-title="Ch. 8 · Back to the Timber Company">
  <div class="scene__sticky"><div class="scene__viz" data-scene-viz="close"></div></div>
  <div class="scene__steps">
    <div class="step" data-beat="scoreboard">
      <div class="step__card">
        <p class="step__kicker">Chapter 8 · Back to the Timber Company</p>
        <p>Except now it's the bank, and the price tag works. Lending earns <strong>1.67%</strong> because it's good at lending — not because funding was free. Deposits earn <strong>3.51%</strong> because the franchise is real — not because nobody measured it. Treasury holds the rate risk both teams shed. On purpose. With a mandate.</p>
      </div>
    </div>
    <div class="step" data-beat="end">
      <div class="step__card">
        <p><strong>Banks that get this right know who creates value. Banks that don't, don't</strong> — they just know the total. Ask the timber company which arm deserves the next dollar of investment. If they can answer, their transfer price is working. Yours should be able to answer too.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================================================================
     ASSUMPTIONS
     ================================================================ -->
<section class="prose">
  <h2>Assumptions, stated out loud</h2>
  <p>This piece optimizes for mechanics over precision. Here is what it holds constant — so you know exactly where the simplifications live:</p>
  <div class="prose__cards">
    <div class="prose__card">
      <h3>The numbers are illustrative</h3>
      <p>Every rate, balance, and decay curve is synthetic — plausible magnitudes, deterministic seeds, no market data. The shapes are real; the levels are props.</p>
    </div>
    <div class="prose__card">
      <h3>The models are stylized</h3>
      <p>One prepayment speed per scenario, one decay curve per product, a 7-year truncation wall, a beta that holds still. Real ALM teams carry distributions and stress paths, not single lines — and argue about the wall's placement, because moving it moves the P&amp;L.</p>
    </div>
    <div class="prose__card">
      <h3>The bank is healthy</h3>
      <p>Underwriting works, funding is routine, and every decision is at the margin. FTP allocates spread — it cannot rescue bad credit or a liquidity crisis.</p>
    </div>
    <div class="prose__card">
      <h3>The curve is a committee</h3>
      <p>Which instruments blend into the base curve, and how the TLP is set, differ bank to bank — and the differences move desk P&amp;L. Treat every curve as someone's judgment call.</p>
    </div>
    <div class="prose__card">
      <h3>Much is left out</h3>
      <p>Capital and liquidity rules beyond a flat charge, hedging mechanics, multi-currency books, contingent facilities. Each is its own chapter in a real framework.</p>
    </div>
    <div class="prose__card">
      <h3>Measurement isn't strategy</h3>
      <p>FTP tells you where the value came from. What to do about it — grow, shrink, reprice, exit — remains a management call it can only inform.</p>
    </div>
  </div>
</section>

<!-- ================================================================
     COLOPHON
     ================================================================ -->
<section class="prose prose--colophon">
  <h2>Notes on construction</h2>
  <p>Built by hand with Hugo and D3 — no chart libraries, no frameworks — with substantial AI assistance. Every number is illustrative; the mechanics are real. The wholesale rates are synthetic, not live market data — but they are not hand-waved either: a single model file holds the curve and every product assumption, and every figure in the charts and the text above derives from it, checked by script so the prose can't drift from the arithmetic.</p>
  <p>If your treasury team wants to argue about any of it: <a href="mailto:jmwest@gmail.com">jmwest@gmail.com</a>.</p>
</section>
