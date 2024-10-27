import {CustomCost, ExponentialCost} from "./api/Costs";
import { Localization } from "./api/Localization";
import {BigNumber, parseBigNumber} from "./api/BigNumber";
import {QuaternaryEntry, theory} from "./api/Theory";
import {Utils} from "./api/Utils";
import {ui} from "./api/ui/UI";
import {Thickness} from "./api/ui/properties/Thickness";
import {TextAlignment} from "./api/ui/properties/TextAlignment";
import {FontAttributes} from "./api/ui/properties/FontAttributes";
import {TouchType} from "./api/ui/properties/TouchType";
import { Vector3 } from "../../../Projects/theory-sdk/api/Vector3";
import {Color} from "./api/ui/properties/Color";
import {CornerRadius} from "./api/ui/properties/CornerRadius";
import {game} from "./api/Game";

requiresGameVersion("1.4.33");

var id = "basel_problem";
var name = "Basel Problem";
var description =
  "The Basel Problem is an ancient problem asking what the infinite series of inverse squares converges to. " +
  "It was first solved by Euler in 1735. ";
var authors = "Python's Koala (pythonskoala)";
var version = 1;
var releaseOrder = "1";

var tauMultiplier = 4;

// internal variables
var currency;
var quaternaryEntries;
var app_was_closed = false;

// upgrade variables
var c1, c2, c3, c4, c5, c6, c7, c8, c9, c10;
var q1 = BigNumber.ONE;
var q2 = BigNumber.ONE;
var q3 = BigNumber.ONE;
var q4 = BigNumber.ONE;
var q5 = BigNumber.ONE;
var q6 = BigNumber.ONE;
var q7 = BigNumber.ONE;
var q8 = BigNumber.ONE;
var q9 = BigNumber.ONE;
var r = BigNumber.ONE;

// milestone variables
var r_upgrade, t_upgrade;
var a_level, final_a_level;
var dimension;

// graph variables
var t_speed;                  // multiplies dt by given value (1 + t_multiplier * dt)
var t = BigNumber.ZERO;       // time elapsed ( -> cos(t), sin(t) etc.)
var num_publications = 0;


var init = () => {
    currency = theory.createCurrency();

    quaternaryEntries = [];

    // Regular Upgrades

    // t
    {
        let getDesc = (level) => "\\dot{t}=" + BigNumber.from(0.2 + (0.2 * level)).toString(level > 3 ? 0 : 1);
        let getInfo = (level) => "\\dot{t}=" + BigNumber.from(0.2 + (0.2 * level)).toString(level > 3 ? 0 : 1);
        t_speed = theory.createUpgrade(0, currency, new ExponentialCost(1e6, Math.log2(1e6)));
        t_speed.getDescription = (_) => Utils.getMath(getDesc(t_speed.level));
        t_speed.getInfo = (amount) => t_speed.level == t_speed.maxLevel ? Utils.getMath(getInfo(t_speed.level)) : Utils.getMathTo(getInfo(t_speed.level), getInfo(t_speed.level + amount));
        t_speed.maxLevel = 4;
    }

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        let getInfo = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(5, 0.1)));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(2, currency, new ExponentialCost(16, 4));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    // c3
    {
        let getDesc = (level) => "c_3=3^{" + level + "}";
        let getInfo = (level) => "c_3=" + getC3(level).toString(0);
        c3 = theory.createUpgrade(3, currency, new ExponentialCost(19683, Math.log2(19683)));
        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level));
        c3.getInfo = (amount) => Utils.getMathTo(getInfo(c3.level), getInfo(c3.level + amount));
    }

    // c4
    {
        let getDesc = (level) => "c_4=4^{" + level + "}";
        let getInfo = (level) => "c_4=" + getC4(level).toString(0);
        c4 = theory.createUpgrade(4, currency, new ExponentialCost(Math.pow(4,16), 32));
        c4.getDescription = (_) => Utils.getMath(getDesc(c4.level));
        c4.getInfo = (amount) => Utils.getMathTo(getInfo(c4.level), getInfo(c4.level + amount));
    }

    // c5
    {
        let getDesc = (level) => "c_5=5^{" + level + "}";
        let getInfo = (level) => "c_5=" + getC5(level).toString(0);
        c5 = theory.createUpgrade(5, currency, new ExponentialCost(Math.pow(5,25), 25*Math.log2(5)));
        c5.getDescription = (_) => Utils.getMath(getDesc(c5.level));
        c5.getInfo = (amount) => Utils.getMathTo(getInfo(c5.level), getInfo(c5.level + amount));
    }

    // c6
    {
        let getDesc = (level) => "c_6=6^{" + level + "}";
        let getInfo = (level) => "c_6=" + getC6(level).toString(0);
        c6 = theory.createUpgrade(6, currency, new ExponentialCost(Math.pow(6,36), 36*Math.log2(6)));
        c6.getDescription = (_) => Utils.getMath(getDesc(c6.level));
        c6.getInfo = (amount) => Utils.getMathTo(getInfo(c6.level), getInfo(c6.level + amount));
    }

    // c7
    {
        let getDesc = (level) => "c_7=7^{" + level + "}";
        let getInfo = (level) => "c_7=" + getC7(level).toString(0);
        c7 = theory.createUpgrade(7, currency, new ExponentialCost(Math.pow(7,49), 49*Math.log2(7)));
        c7.getDescription = (_) => Utils.getMath(getDesc(c7.level));
        c7.getInfo = (amount) => Utils.getMathTo(getInfo(c7.level), getInfo(c7.level + amount));
    }

    // c8
    {
        let getDesc = (level) => "c_8=8^{" + level + "}";
        let getInfo = (level) => "c_8=" + getC8(level).toString(0);
        c8 = theory.createUpgrade(8, currency, new ExponentialCost(Math.pow(8,64), 64*Math.log2(8)));
        c8.getDescription = (_) => Utils.getMath(getDesc(c8.level));
        c8.getInfo = (amount) => Utils.getMathTo(getInfo(c8.level), getInfo(c8.level + amount));
    }

    // c9
    {
        let getDesc = (level) => "c_9=9^{" + level + "}";
        let getInfo = (level) => "c_9=" + getC9(level).toString(0);
        c9 = theory.createUpgrade(9, currency, new ExponentialCost(Math.pow(9,81), 81*Math.log2(9)));
        c9.getDescription = (_) => Utils.getMath(getDesc(c9.level));
        c9.getInfo = (amount) => Utils.getMathTo(getInfo(c9.level), getInfo(c9.level + amount));
    }

    // c10
    {
        let getDesc = (level) => "c_{10}=10^{" + level + "}";
        let getInfo = (level) => "c_{10}=" + getC10(level).toString(0);
        c10 = theory.createUpgrade(10, currency, new ExponentialCost(Math.pow(10,100), 100*Math.log2(10)));
        c10.getDescription = (_) => Utils.getMath(getDesc(c10.level));
        c10.getInfo = (amount) => Utils.getMathTo(getInfo(c10.level), getInfo(c10.level + amount));
    }


    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e15);
    theory.createAutoBuyerUpgrade(2, currency, 1e25);

    // Milestone Upgrades
    theory.setMilestoneCost(new CustomCost(total => BigNumber.from(getCustomCost(total)*tauMultiplier)));

    {
        r_upgrade = theory.createMilestoneUpgrade(0, 1);
        r_upgrade.getDescription = () => "$\\text{Invert } \\dot{r} \\text{ equation}$";
        r_upgrade.getInfo = () => "Inverts the $\\dot{r}$ equation";
        r_upgrade.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); theory.invalidateSecondaryEquation(); theory.invalidateTertiaryEquation(); updateAvailability();}
        r_upgrade.canBeRefunded = (_) => t_upgrade == 0;
    }

    {
        t_upgrade = theory.createMilestoneUpgrade(1, 1);
        t_upgrade.getDescription = () => "Improve variable $t$.";
        t_upgrade.getInfo = () => "Moves $t$ outside the $a$ exponent."
        t_upgrade.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); theory.invalidateSecondaryEquation(); theory.invalidateTertiaryEquation(); updateAvailability();}
        t_upgrade.canBeRefunded = (_) => a_level == 0;
    }

    {
        a_level = theory.createMilestoneUpgrade(2, 6);
        a_level.getDescription = (_) => "$\\uparrow a$ by 0.05";
        a_level.getInfo = () => "$a \to 0.3 + $" + (0.3 + a_level.level * 0.05).toFixed(2);
        a_level.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        a_level.canBeRefunded = (_) => dimension.level == 0;
    }

    {
        dimension = theory.createMilestoneUpgrade(3, 8);
        dimension.getDescription = () => "Unlock $q_" + (dimension.level + 2) + "$";
        dimension.getInfo = () => Localization.getUpgradeAddDimensionDesc();
        dimension.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); theory.invalidateSecondaryEquation(); theory.invalidateTertiaryEquation(); updateAvailability(); }
        dimension.canBeRefunded = (_) => final_a_level == 0;
    }

    {
        final_a_level = theory.createMilestoneUpgrade(4, 1);
        final_a_level.getDescription = () => "$a \to \frac{6}{\pi^2}";
        final_a_level.getInfo = () => "Sets $a = \frac{6}{\pi^2}";
        final_a_level.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        final_a_level.canBeRefunded = (_) => true;
    }

    // Story Chapters
    let story_chapter_1 = "";
    story_chapter_1 += "You find an interesting unsolved problem in an old mathematics textbook.\n";
    story_chapter_1 += "The problem is an infinite series of inverse squares.\n";
    story_chapter_1 += "You approach your professor with this problem.\n";
    story_chapter_1 += "She looks at you and says, \"Do you know if this series converges?\"\n";
    story_chapter_1 += "You reply, \"I'm not sure, but that is what I want to figure out.\"\n";
    story_chapter_1 += "She looks at your old textbook again.\n";
    story_chapter_1 += "\"This has been an unsolved problem for centuries. Do you think you can crack it?\"\n"
    story_chapter_1 += "You look at the sheet of paper, thinking some more.\n";
    story_chapter_1 += "\"It has an infinite number of terms, and they are all positive, so it probably diverges, right?\"\n";
    story_chapter_1 += "\"And I think I know how to prove it.\"\n";
    story_chapter_1 += "You create a little term named 'r' and start work on the project.";
    theory.createStoryChapter(0, "Infinite Series", story_chapter_1, () => c1.level == 0); // unlocked at beginning of the theory

    let story_chapter_2 = "";
    story_chapter_2 += "You start your research with excitement.\n";
    story_chapter_2 += "You manage to publish a lemma relating to the problem in a small journal.\n";
    story_chapter_2 += "Pleased with your progress, you continue to press ahead.\n";
    story_chapter_2 += "But somewhere in the back of your mind\n";
    story_chapter_2 += "you can't quite shake the feeling that you've missed something.\n";
    story_chapter_2 += "You go over and double check all of your equations again to be sure.";
    theory.createStoryChapter(1, "Uneasy Feeling", story_chapter_2, () => num_publications > 0); // unlocked at rho = 1e7

    let story_chapter_3 = "";
    story_chapter_3 += "You've spent weeks staring at your formula to no avail.\n";
    story_chapter_3 += "Progress is starting to slow substantially.\n";
    story_chapter_3 += "Desperation is setting in.\n";
    story_chapter_3 += "All of a sudden, you wake up in the middle of the night with an idea.\n";
    story_chapter_3 += "What if your hypothesis was wrong?\n";
    story_chapter_3 += "What if the series doesn't diverge\n";
    story_chapter_3 += "and converges after all?\n";
    story_chapter_3 += "You make a small modification to the computation of rdot.";
    theory.createStoryChapter(2, "Challenging Assumptions", story_chapter_3, () => currency.value > BigNumber.from(1e10)); // unlocked at R dimension milestone

    let story_chapter_4 = "";
    story_chapter_4 += "Your progress has improved dramatically since revisiting your hypothesis.\n";
    story_chapter_4 += "It is now pretty clear that the series converges.\n";
    story_chapter_4 += "But what does it converge to?\n";
    story_chapter_4 += "You're starting to get stuck again.\n";
    story_chapter_4 += "Maybe making time move faster will help.\n";
    story_chapter_4 += "You take the variable 't' and move it to a different part of your equation.";
    theory.createStoryChapter(3, "Temporal Manipulation", story_chapter_4, () => currency.value > BigNumber.from(1e15)); // unlocked at I dimension milestone

    let story_chapter_5 = "";
    story_chapter_5 += "You manage to create a lower bound for the number the series converges to.\n";
    story_chapter_5 += "But you aren't sure how to make an upper bound.\n";
    story_chapter_5 += "You ask your professor what you should do.\n";
    story_chapter_5 += "She looks at your equation and says:\n";
    story_chapter_5 += "\"Have you tried modifying the variable 'a'?\"\n";
    story_chapter_5 += "You realize that in all your research, you'd never thought to change that value.\n";
    story_chapter_5 += "You try increasing the value of 'a', and see what happens.\n";
    theory.createStoryChapter(4, "Exponential Growth", story_chapter_5, () => currency.value > BigNumber.from(1e20)); // unlocked at a_base first milestone

    let story_chapter_6 = "";
    story_chapter_6 += "It worked!\n"
    story_chapter_6 += "Changing the variable 'a' has allowed you to create an upper bound for the convergence of the equation.\n";
    story_chapter_6 += "Right now though, your bounds aren't very precise.\n";
    story_chapter_6 += "You've bounded the series to converge to a value between 1 and 2.\n";
    story_chapter_6 += "But you want to improve the bounds.\n";
    story_chapter_6 += "You look over your equation again and realize you've never manipulated the variable 'q1'.\n";
    story_chapter_6 += "You try adding a variable 'q2' and see what happens.";
    theory.createStoryChapter(5, "Bounds", story_chapter_6, () => currency.value > BigNumber.from(1e50)); // unlocked at a_base last milestone

    let story_chapter_7 = "";
    story_chapter_7 += "You've been making good progress.\n";
    story_chapter_7 += "You can feel you're getting close now.\n";
    story_chapter_7 += "You've bounded the series convergence value to between 1.6 and 1.65.\n";
    story_chapter_7 += "But you're not satisfied.\n";
    story_chapter_7 += "You want to know the exact value.\n";
    story_chapter_7 += "You continue onwards...";
    theory.createStoryChapter(6, "Getting Close", story_chapter_7, () => currency.value > BigNumber.from(1e400)); // unlocked at a_exponent first milestone

    let story_chapter_8 = "";
    story_chapter_8 += "Months have passed.\n";
    story_chapter_8 += "You still haven't managed to improve your bounds on the convergence value.\n";
    story_chapter_8 += "But what else can you do?\n";
    story_chapter_8 += "You've tried manipulating every variable in the theory.\n";
    story_chapter_8 += "You're getting desperate.\n";
    story_chapter_8 += "Is this the end?\n";
    story_chapter_8 += "You're not quite ready to give up yet.\n";
    story_chapter_8 += "You continue to forge ahead with your research, as slow as it might be.\n";
    theory.createStoryChapter(7, "Desperation", story_chapter_8, () => currency.value > BigNumber.from(1e1400)); // unlocked at a_exp and a_base max milestone

    let story_chapter_9 = "";
    story_chapter_9 += "One night, you sleep restlessly.\n";
    story_chapter_9 += "What does it converge to?\n";
    story_chapter_9 += "You've gotten so close.\n";
    story_chapter_9 += "But you haven't been able to make much of any progress recently.\n";
    story_chapter_9 += "Even so, thoughts of your series twist in your mind.\n"
    story_chapter_9 += "Suddenly, you see it.\n";
    story_chapter_9 += "The terms of the series twist in your mind and in the limit, there is one number.\n";
    story_chapter_9 += "pi^2/6.\n";
    story_chapter_9 += "The series converges to pi^2/6.\n";
    story_chapter_9 += "And you know how to prove it.\n";
    story_chapter_9 += "You leap out of bed.\n";
    story_chapter_9 += "Hands shaking with excitement, you make one final change to the variable 'a'.\n";
    theory.createStoryChapter(8, "EUREKA!!!", story_chapter_9, () => b_base.level > 0); // unlocked at tau = e100 (b2 first milestone)

    let story_chapter_10 = "";
    story_chapter_10 += "You've finally done it.\n"
    story_chapter_10 += "You have proven that the series converges to pi^2/6.\n"
    story_chapter_10 += "You've published your work in a prestigious journal.\n"
    story_chapter_10 += "You've been asked to present your work at top mathematics conferences.\n"
    story_chapter_10 += "Your professor approaches you and says,\n"
    story_chapter_10 += "\"I'm so proud of you.\n"
    story_chapter_10 += "I always knew you could do it.\n";
    story_chapter_10 += "This problem had been unsolved for centuries.\n";
    story_chapter_10 += "None of my other students would even touch it.\n";
    story_chapter_10 += "But you not only proved the series converged.\n";
    story_chapter_10 += "You even found what it converged to, with a very elegant proof.\n";
    story_chapter_10 += "There's a faculty opening in mathematics at our university. Are you interested?\"\n";
    story_chapter_10 += "You accept the offer and get to work as a professor.\n\n\n";
    story_chapter_10 += "The End.";
    theory.createStoryChapter(9, "The End", story_chapter_10, () => predicateAndCallbackPopup()); // unlocked at tau = e600 (finished)

    updateAvailability();
}

// INTERNAL FUNCTIONS
// -------------------------------------------------------------------------------

// written by gilles
let e600 = BigNumber.from("1e600");
var predicateAndCallbackPopup = () => {
    if (theory.tau >= e600) {
        getEndPopup.show();
        return true;
    }
    return false;
}

// written by xlii
var getCustomCost = (level) => {
    return 8 * (level + 1)
};

var updateAvailability = () => {
    t_speed.isAvailable = true;
    r_upgrade.isAvailable = true;
    t_upgrade.isAvailable = r_upgrade.level > 0;
    a_level.isAvailable = t_upgrade.level > 0;
    dimension.isAvailable = a_level.level > 5;
    final_a_level.isAvailable = dimension.level > 7;


    c1.isAvailable = true;
    c2.isAvailable = true;
    c3.isAvailable = dimension.level > 0;
    c4.isAvailable = dimension.level > 1;
    c5.isAvailable = dimension.level > 2;
    c6.isAvailable = dimension.level > 3;
    c7.isAvailable = dimension.level > 4;
    c8.isAvailable = dimension.level > 5;
    c9.isAvailable = dimension.level > 6;
    c10.isAvailable = dimension.level > 7;

    q2.isAvailable = dimension.level > 0;
    q3.isAvailable = dimension.level > 1;
    q4.isAvailable = dimension.level > 2;
    q5.isAvailable = dimension.level > 3;
    q6.isAvailable = dimension.level > 4;
    q7.isAvailable = dimension.level > 5;
    q8.isAvailable = dimension.level > 6;
    q9.isAvailable = dimension.level > 7;
}

var postPublish = () => {
    t = BigNumber.ZERO;
    q1 = BigNumber.ZERO;
    q2 = BigNumber.ONE;
    q3 = BigNumber.ONE;
    q4 = BigNumber.ONE;
    q5 = BigNumber.ONE;
    q6 = BigNumber.ONE;
    q7 = BigNumber.ONE;
    q8 = BigNumber.ONE;
    q9 = BigNumber.ONE;
    r = BigNumber.ZERO;
    num_publications++;
}

var getInternalState = () => `${num_publications} ${t} ${q1} ${q2} ${q3} ${q4} ${q5} ${q6} ${q7} ${q8} ${q9} ${r}`

var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) num_publications = parseInt(values[0]);
    if (values.length > 1) t = parseBigNumber(values[1]);
    if (values.length > 2) q1 = parseBigNumber(values[2]);
    if (values.length > 3) q2 = parseBigNumber(values[3]);
    if (values.length > 4) q3 = parseBigNumber(values[4]);
    if (values.length > 5) q4 = parseBigNumber(values[5]);
    if (values.length > 6) q5 = parseBigNumber(values[6]);
    if (values.length > 7) q6 = parseBigNumber(values[7]);
    if (values.length > 8) q7 = parseBigNumber(values[8]);
    if (values.length > 9) q8 = parseBigNumber(values[9]);
    if (values.length > 10) q9 = parseBigNumber(values[10]);
    if (values.length > 11) r = parseBigNumber(values[11]);
}


var getEndPopup = ui.createPopup({
    title: "The End",
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                heightRequest: 309,
                cornerRadius: 0,
                content: ui.createLabel({text: "\nYou have reached the end of Basel Problem. This theory ends at the CT limit of 1e600, it however can go higher (if you really want to push it.)\nWe hope you enjoyed playing through this, as much as we did, making and designing this theory!\n\nCheck out the other Custom Theory that came packaged with the new update: \"Convergents to sqrt(2)\" after you have played this, if you haven't already!\n\nPS: If you made it this far, DM peanut#6368 about how bad of a language JavaScript is.",
                    padding: Thickness(12, 2, 12, 2),
                    fontSize: 15
                })
            }),
            ui.createLabel({
                text: "Thanks for playing!",
                horizontalTextAlignment: TextAlignment.CENTER,
                fontAttributes: FontAttributes.BOLD,
                fontSize: 18,
                padding: Thickness(0, 18, 0, 18),
            }),
            ui.createButton({text: "Close", onClicked: () => getEndPopup.hide()})
        ]
    })
});



var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;

    if(game.isCalculatingOfflineProgress) {
        app_was_closed = true;
    } else if (app_was_closed) {
        theory.clearGraph();
        app_was_closed = false;
    }

    if (c1.level > 0) {
        // t calc
        t += ((1 + t_speed.level) / 5) * dt;

        // q calc
        if (dimension.level > 7) {
            let vc10 = getC10(c10.level);
            q9 += vc10 * dt / 1000;
        }
        if (dimension.level > 6) {
            let vc9 = getC9(c9.level);
            q8 += vc9 * q9 * dt / 1000;
        }
        if (dimension.level > 5) {
            let vc8 = getC8(c8.level);
            q7 += vc8 * q8 * dt / 1000;
        }
        if (dimension.level > 4) {
            let vc7 = getC7(c7.level);
            q6 += vc7 * q7 * dt / 1000;
        }
        if (dimension.level > 3) {
            let vc6 = getC6(c6.level);
            q5 += vc6 * q6 * dt / 1000;
        }
        if (dimension.level > 2) {
            let vc5 = getC5(c5.level);
            q4 += vc5 * q5 * dt / 1000;
        }
        if (dimension.level > 1) {
            let vc4 = getC4(c4.level);
            q3 += vc4 * q4 * dt / 1000;
        }
        if (dimension.level > 0) {
            let vc3 = getC3(c3.level);
            q2 += vc3 * q3 * dt / 1000;
        }

        let vc2 = getC2(c2.level);
        q1 += vc2 * q2 * dt;

        // r calc
        r += getRdot(getC1(c1.level, r_upgrade.level > 0)) * dt;

        if (t_upgrade.level == 0) {
            currency.value += dt * bonus * (t * q1 * r).pow(getA(a_level.level));
        }
    }

    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
}
// -------------------------------------------------------------------------------


// EQUATIONS
// -------------------------------------------------------------------------------
var getPrimaryEquation = () => {
    theory.primaryEquationScale = 1;
    theory.primaryEquationHeight = 80;

    // let everything be centered -> "{c}"
    let result = "\\begin{array}{c}\\dot{\\rho} = ";

    if (t_upgrade.level > 0) {
        result += "t";
    }

    let inside_parens_term;
    if (t_upgrade.level > 0) {
        inside_parens_term = "t q_1 r";
    } else {
        inside_parens_term = "q_1 r";
    }

    result += "(" + inside_parens_term + ")^a\\\\";

    result += "a = ";

    if (final_a_level.level == 0) {
        result += getA(a_level.level).toNumber().toString(2);
    } else {
        result += "\\frac{6}{\\pi^2}"
    }

    result += "\\end{array}";
    return result;
}

var getSecondaryEquation = () => {
    let result = "\\begin{array}{c}";

    if (dimension.level == 0) {
        result += "\\dot{q_1} = c_2";
    } else if (dimension.level == 1) {
        result += "\\dot{q_1} = c_2 q_2";
        result += "\\dot{q_" + (dimension.level + 1) + "} = c_" + (dimension.level + 2) + "/1000";
    }
    else {
        result += "\\dot{q_1} = c_2 q_2";
        result += "\\dot{q_i} = c_{i+1} q_{i+1}/1000, \\quad 2 \\leq i \\leq " + dimension.level + "\\\\";
        result += "\\dot{q_" + (dimension.level + 1) + "} = c_" + (dimension.level + 2) + "/1000";
    }

    result += "\\\\";

    if (r_upgrade.level > 0) {
        result += "\\dot{r} = \\left(\\sum\\limits_{i=c_1}^{\\infty} \\frac{1}{i^2}\\right)^{-1}";
    } else {
        result += "\\dot{r} = \\sum\\limits_{i=1}^{c_1} \\frac{1}{i^2}";
    }

    result += "\\end{array}";
    return result;
}

var getTertiaryEquation = () => {
    let result = theory.latexSymbol + "=\\max\\rho^{0.4}";
    return result;
}

var getQuaternaryEntries = () => {
    if (quaternaryEntries.length == 0) {
        quaternaryEntries.push(new QuaternaryEntry("t", null));
        quaternaryEntries.push(new QuaternaryEntry("q_1", null));
        for (let i = 1; i <= dimension.level; i++) {
            quaternaryEntries.push(new QuaternaryEntry("q_1", null));
        }
        quaternaryEntries.push(new QuaternaryEntry("r", null));
    }

    quaternaryEntries[0].value = t.toString(2);
    idx = 1
    q_values = [q1, q2, q3, q4, q5, q6, q7, q8, q9]
    for (let i = 0; i <= dimension.level; i++) {
        quaternaryEntries[idx] = q_values[i].toString(2);
        idx += 1
    }
    quaternaryEntries[idx].value = r.toString(2);

    return quaternaryEntries;
}
// -------------------------------------------------------------------------------

var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();
var getPublicationMultiplier = (tau) => tau.pow(0.1321/tauMultiplier);
var getPublicationMultiplierFormula = (symbol) => symbol + "^{0.1321}";
var isCurrencyVisible = (index) => index == 0 || (index == 1 && dimension.level > 0) || (index == 2 && dimension.level > 1);
var getTau = () => currency.value.pow(BigNumber.from(0.1*tauMultiplier));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(2.5/tauMultiplier), currency.symbol];

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC3 = (level) => BigNumber.THREE.pow(level);
var getC4 = (level) => BigNumber.FOUR.pow(level);
var getC5 = (level) => BigNumber.FIVE.pow(level);
var getC6 = (level) => BigNumber.SIX.pow(level);
var getC7 = (level) => BigNumber.SEVEN.pow(level);
var getC8 = (level) => BigNumber.EIGHT.pow(level);
var getC9 = (level) => BigNumber.NINE.pow(level);
var getC10 = (level) => BigNumber.TEN.pow(level);
var getA = (level, final_a) => (final_a ? BigNumber.from(6/(Math.pi*Math.pi)) : BigNumber.from(0.3 + 0.05 * level));

var getRdot = (c1, r_ms) => {
    if (c1 == 0) {
        return 0;
    }

    if (c1 <= 100) { // exact computation
        let sum = BigNumber.ZERO;
        for (let i = 1; i < c1; i++) {
            sum = sum.plus(BigNumber(1).div(i * i));
        }
        if (r_ms) {
            return BigNumber(1).div(BigNumber(Math.PI * Math.PI).div(6).minus(sum));
        }
        return sum.plus(BigNumber(1).div(c1 * c1));
    }

    let approx_sum = BigNumber(1).div(c1).plus(BigNumber(1).div(BigNumberTWO.multipliedBy(c1.pow(BigNumber.TWO))));
    
    if (r_ms) {
        return BigNumber(1).div(approx_sum);
    }
    
    return Math.PI * Math.PI / 6 - approx_sum + BigNumber.ONE.div(c1.pow(BigNumber.TWO));
}

init();