export const getCoachs = async (cheerioInput) => {
  const INFO_COACHS_SELECTORS = {
    teamName: { selector: ".name.mt10", typeOf: "string" },
    coach: { selector: ".name.mt20", typeOf: "string" },
    coachImg: { selector: ".player-circle-box", typeOf: "string" },
  };

  // const $ = await scrape(URLS.coachs);
  const coachsTeam = cheerioInput(INFO_COACHS_SELECTORS.coach.selector)
    .toArray()
    .map((coachName) => coachName.children[0].data);
  const coachsImgTeam = cheerioInput(INFO_COACHS_SELECTORS.coachImg.selector)
    .toArray()
    .map((coachImg) => {
      const { attribs } = coachImg;
      const { src } = attribs;
      return src;
    });
  const teamsName = cheerioInput(INFO_COACHS_SELECTORS.teamName.selector)
    .toArray()
    .map((teamName) => teamName.children[0].data);
  const teamsWithCoach = coachsTeam.map((coach, i) => {
    return {
      name: coach,
      // teamName: replaceFCOfTeamName(teamsName[i]),
      teamName: teamsName[i],
      image: coachsImgTeam[i],
    };
  });
  return teamsWithCoach;
};
