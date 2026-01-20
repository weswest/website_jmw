# Interview Questions for Voice Recording

**GitHub Issues:** `gh issue list --label interview_questions`

Each question has a corresponding GitHub issue for tracking. Record ~15-30 min voice memos, transcribe, and paste answers below.

---

## Status Tracker

| # | Topic | Status | GitHub Issue |
|---|-------|--------|--------------|
| Q1 | The Model Factory Story | ✅ Done | [#9](https://github.com/weswest/website_jmw/issues/9) |
| Q2 | Huntington Culture Turnaround | ✅ Done | [#10](https://github.com/weswest/website_jmw/issues/10) |
| Q3 | Project Not on Resume | ✅ Done | [#11](https://github.com/weswest/website_jmw/issues/11) |
| Q4 | Why the MS in Data Science | ⏳ Pending | [#12](https://github.com/weswest/website_jmw/issues/12) |
| Q5 | Consulting ↔ Corporate Pivot | ⏳ Pending | [#13](https://github.com/weswest/website_jmw/issues/13) |
| Q6 | Pragmatic AI Philosophy | ⏳ Pending | [#14](https://github.com/weswest/website_jmw/issues/14) |
| Q7 | What Keeps You Up at Night | ⏳ Pending | [#15](https://github.com/weswest/website_jmw/issues/15) |
| Q8 | The Recipe Project | ⏳ Pending | [#16](https://github.com/weswest/website_jmw/issues/16) |
| Q9 | MIT to Banking Analytics | ⏳ Pending | [#17](https://github.com/weswest/website_jmw/issues/17) |
| Q10 | Advice to Younger Self | ⏳ Pending | [#18](https://github.com/weswest/website_jmw/issues/18) |

---

## Recording Tips

- **Length**: 15-30 minutes per question
- **Style**: Conversational, like explaining to a colleague over coffee
- **Details**: Specific examples > general principles. Names, numbers, moments.
- **Format**: Voice memos on phone, then transcribe (or use voice-to-text)

---

## Questions Reference

### Q1: The "Model Factory" Story
**Your resume mentions you established a "model factory" approach at Novantas that's now used to forecast >10% of all US bank deposits. Walk me through:**
- What problem were you trying to solve?
- What was broken about the old way of building CCAR models?
- What made your approach different/better?
- What was the "aha moment" when you realized this would work at scale?

### Q2: The Huntington Culture Turnaround
**You took employee satisfaction from -45 to +92 while tripling headcount. Tell me:**
- What was broken when you arrived?
- What were the first signals that things needed to change?
- What were the 2-3 most impactful things you did?
- Any specific person or moment that symbolizes the transformation?

### Q3: A Project You're Proud of (Not on Resume)
**Tell me about a project or accomplishment that didn't make the resume but that you're genuinely proud of:**
- Could be a "save" (rescued a failing project)
- Could be something politically complex you navigated
- Could be mentoring someone who went on to great things
- What made it meaningful to you personally?

### Q4: Why the MS in Data Science
**You already had 15+ years as a successful analytics leader. What made you decide to do Northwestern's MS in Data Science with AI specialization?**
- What were you hoping to gain?
- What actually surprised you about the program?
- How has it changed how you think about your work?
- What's one specific thing you learned that you've already applied at Nomis?

### Q5: The Consulting ↔ Corporate Pivot
**You've gone: Big bank → Consulting → Big bank → Consulting → C-suite. What have you learned about the differences?**
- When is consulting the right career move vs. corporate?
- What do consultants get wrong about how banks actually work?
- What do bank employees misunderstand about what consultants do?
- Career advice for someone making this pivot?

### Q6: The Pragmatic AI Philosophy
**Your articles emphasize "humans in the loop" and avoiding AI hype. Where did this philosophy come from?**
- Was there a specific moment when you saw AI overpromised and underdelivered?
- How do you balance being cutting-edge vs. being practical?
- What's an AI use case in banking that's overrated? Underrated?

### Q7: What Keeps You Up at Night
**As CAO at a fintech serving major banks, what are you worried about for the next 2-3 years?**
- Tech trends? Regulatory changes? Market conditions?
- What opportunity do you think banks are missing?
- What do you wish clients understood better about pricing/analytics?

### Q8: The Recipe Project
**Tell me about your relationship with cooking:**
- Are you an "intuitive cook" or "follow the recipe exactly" person?
- What's a dish people always ask you for the recipe?
- Is there a food/cooking philosophy that connects to analytics or business?
- Any family recipes or food traditions that matter to you?

### Q9: MIT Economics to Banking Analytics
**Your MIT degree was in Economics with stats/modeling specialization. How did you find your way into this career?**
- Was this the plan, or did you stumble into it?
- Who or what influenced your direction early on?
- What skills from MIT do you still use constantly?
- What do you wish you'd learned in school?

### Q10: Advice to Your Younger Self
**If you could talk to yourself at age 25, just starting at First Manhattan:**
- What would you tell him about career, learning, life balance?
- What would you tell him NOT to worry about?
- What should he worry about more?

---

# Transcripts

## Q1: The Model Factory Story

This is really a great question OK so if you rewind the clock to 2013 2014 the state of the world state of the financial services world was that banks had really gotten in a lot of trouble during the economic downturn of 2008 2009 by being unable to tell the federal government what would happen to their balance sheet if the economy were to crash it resulted in the formalization of the ccar forecasting process where banks were required to stress test their balance sheet under various macroeconomic conditions to do that correctly and in a way that adhered to regulatory expectations an entire industry of model monitoring validation and documentation grew in like 2 years and what that meant was that suddenly everybody that was working in the ccar stress testing world needed to suddenly become like buttoned up and diligent statistics managers in addition to business managers we at novantas were consultants and we took advantage of the regulatory situation to sell a ton of ccar modeling work and the thing that ended up being so tough about the ccar modeling work was that we needed to pull in the best of sort of like automated model generation and the best of keeping track of business requirements because the key element of the ccar modeling was that like everything needed to make sense and there were only a handful of drivers that were being provided the federal government provided you with like 20 variables macroeconomic and rate and non rate variables that you could use in the models and so we describe it we would always describe it as a three legged stool where the models needed to be statistically valid in like stats test needed to pass needed to be accurate and it needed to make sense from a business perspective so coefficient the set of drivers needed to be logical the coefficients needed to point in the correct direction so it's just like really tough to get all that done correctly and quickly

So like now that I have more modeling experience and we're doing this in the most bass ackwards way possible we were using excel files to produce our code and just like we're hacking together what we could and if we had tools like ML flow or data robot or something like that this all would have been like super streamlined but we essentially needed to make the homegrown version of those tools with really strong regulatory transparency in a way that would let us as consultants hand over a bunch of code to essentially first and second year college graduates and produce like really good statistical models so that's the whole notion of the factory is like we really were creating this like assembly line process of how to build robust but transparently acceptable models using folks that hadn't been formally trained in statistics

## Q2: The Huntington Culture Turnaround

Um the biggest impact to the team was a mindset shift for what the team's purpose was we when I arrived it was regulatory box tracking and when I left it was a strategic powerhouse the work that that team did does is hugely impactful both from like a like meta fuzzy perspective because the information goes directly into earnings reports and really shapes kind of like the CFO talk track at quarterly filings but also practically asset liability management team with that's running well is like the brain of the bank because they know how the entire balance sheet is going to evolve over time that becomes an incredibly rich data source to tap into for strategic decision making and becomes an important partner in all sorts of decisions because if I make this impact here on the balance sheet what impact is it going to have on my colleagues and this other area of the balance sheet and my role as the head of asset liability strategy it became really important to like have a seat at that table and then the team saw the impact we were having and introducing purpose other than like um needing to get this box done because otherwise the CFO is going to yell at you was really hugely transformational

There was a guy who led the team named epoch um who was a pedant a couple of times information had come out of the team in a way that was incorrect and leadership had come down really hard on him he was the guy who was responsible for executing the balance sheet forecast using the QRM tool and because he had been yelled at a couple of times it had really made him gun shy like this is going to be a 0 error team which meant that he oftentimes we would call it the depot vortex where he would get his entire analyst team of five people and they would sit in his office for three hours at a time collectively going line by line over every number and it's just a huge waste of time and incredibly demoralizing because like spending 15 hours to find out whether like a single rate pointer for 115th of the balance sheet have been coded incorrectly so removed him from from the equation

Um I think one of the most impactful lessons I saw on that team this was really my first time dealing with mid level performers it's something I talked about with my HR partner all the time while working there every other job I'd had prior to this one the people that I managed were really high performers and this is the first time that it was like OK I had a group of people where this was just a job like clock in at 830 clock out at 4:57 and if things didn't go well it's like fine whatever it's not my problem um there were there was one higher or there was one woman on the modeling team in particular that um seemed like she was doing fine like you couldn't really complain about her performance by the way this also was the first time I was managing A-Team where I didn't know how to do the work every other job I'd ever had before I was like the first among equals and so even though I had managed pretty freaking big teams if you're managing your consulting team like and you came up through the consulting ranks you've done every job you have been the first year who is taking notes you have been the second year who has gone and run a data request you have been the third year who is like orienting for a weekly update meeting... all the way up to being the managing director which I was but this was the first time I needed to actually trust employees to um do work that I didn't have hands on experience doing myself and this woman Tina was responsible for monitoring model accuracy on a quarterly basis and monitoring model accuracy is certainly something I had done but I hadn't done it at this bank I didn't have my hands dirty in exactly all the requirements and so I needed to sort of like trust her that it was getting done quote we were a little sad to see her go but whatever and we moved her work over to another woman named Jiang Wan and jinglin looked at the process that Tina had implemented and thought it was insane and jiangnan spent a month or two re architecting everything and suddenly tina's job that had formerly taken 10 weeks was getting done in a week and 1/2 and it was it made me deeply skeptical of mid level performers because it taught me that like whether you care or not like jalen doesn't care at all but jalen was like lazy in that computer programmer way of like I'm going to try to make my world better and so it made me it made me realize that like in addition to the dimensions of like mindset about whether you care about a job and the dimension of intelligence whether you are sort of like an equally smart there's this third orthogonal access which is just like what are we trying to achieve and what's the best way to achieve it and how important it is to focus on people who understand the tradeoff between like doing more work today so that the future becomes a heck of a lot easier versus those that never even think about that umm just two people that I think bear calling out first is Randall so Randall was like the senior analyst reporting to Deepak when I arrived and after a little bit of time I essentially demoted epoch and put Randall in that position he's gone on to do great things throughout the organization he's going to be at Huntington for life which is fine but he and I used to always joke about how like he was watching me build an empire and that wasn't really the case but but just like I kept telling him that the only way that I stay excited about a job is if I find something that's like badly broken figure out how to fix it and get that into maintenance mode and then take on new challenges and I think I think the team saw that like the team saw that the poor perception of the of the of the team by senior leadership some of the underinvestment in team resources that wasn't the only way it could be it could be different and I think making that change made people really satisfied

## Q3: Project Not on Resume (Negative Rates / LIBOR Transition)

So it looks like it leave this from my resume um I had been at Huntington for about 6 months and it looked like market rates may have gone may may may go negative which was a huge deal for banks um it the way the organization handled situations like that I was just so impressed by Steve or CEO when I saw Steve do maybe every like 4 to 6 months was massively freak out about something happening in the economy or something happening in the political landscape and when Steve had a massive freak out like the entire organization rallied to make sure that we were well positioned to handle that situation and so like the Russian invasion of Ukraine was one of those and what impact that would have on all sorts of things et cetera et cetera et cetera the thing I found so amazing about Steve sort of in the same vein was how he was always running to simulations of the world he had a like business as usual things are generally fine view of things and he had this catastrophizing chicken little view of things and I could tell that he knew which areas of the business could be relied on to handle those two different situations and then of course like his leadership team had to be facile at handling both by the way um maybe like two times out of three or three times out of four it really was catastrophizing over nothing like things sort of worked themselves out but when things weren't weird umm things went weird um the benefit of that catastrophizing was that the organization had a plan and so there were there were a handful of um events in my role as the head of asset liability strategy I was like so focused on what was happening in market rates um and it really gave me an opportunity to shine in a couple areas one is in helping the bank figure out the transition from Libor to so far by the way editors note that is the sofa rate sofr and the other was helping the bank prep for what would happen with negative interest rates um I think the reason why those were so exciting to me was because like from a content perspective it was squarely in my arena like what impact will a shift in the benchmark rate from Libor to sofr have on the bank like AL person is the one responsible for answering that question and similarly on negative rates that's a real discontinuity in behavior and so like what's going to happen to the balance sheet overall sort of is my responsibility but I think the thing that makes me so proud of that work was that it was an opportunity at Huntington for me to bring in the consulting experience of really taking this like sort of like unknown and pulling together the consulting framework of these are all the things that could happen this is what's likely going to happen and these are the sorts of things that we need to like watch out for but we really don't need to pay attention to and then being able to see the organization sort of like rally around um those likely impacts and then figure out like the mitigants it led to some really interesting behaviors and learnings like we have we had a huge technology platform that managed the application of deposit interest rates and you were not allowed to put in a negative number and so it was technologically impossible for us to offer a savings account with a - 5 basis point rate which would be a huge problem if rates went to like -80 basis points because then like a - 5 savings rate is exactly what it should be and so like there were not many opportunities in the balance sheet strategy world where it really was a highly quantitative and sort of like sort of like factual job and of course there was like strategic insight on top of the facts but for the most part like the data was 90% known and then it was 10% on site but for these other projects it was more like the data's 30% known and it's 70% insight and for the most part like the things I said were material shapers and how the organization responded
