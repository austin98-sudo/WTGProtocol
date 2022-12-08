function pregnancyCat(category) {
  switch (category) {
    case "A":
      alert("There is no risk to the fetus");
      break;

    case "B":
      alert("There is no adequate studies in pregnant women");
      break;

    case "C":
      alert("There is no human studies. Potential benefits may warrant use of drug despite potential risks.");
      break;

    case "D":
      alert(
        "There is a positive evidence of human fetal risk, but potential benefits may warrant use of drug despite risks"
      );
      break;

    case "X":
      alert("There is positive evidence of human fetal risk that outweigh potential benefits.");
      break;

    default:
      break;
  }
}
