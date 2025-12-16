import { Container, Grid, Tabs } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import styles from "../../styles/components/multitab.module.scss";

export const DisclaimerMultitab = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sections = [
    {
      title: "General Description of LIBRARY",
      content: `The WHO Traditional Medicine Global Library (The Library) is a digital Library that provides comprehensive access to scientific and technical literature in Traditional, Complementary, and Integrative Medicine (TCIM) for researchers, practitioners, policymakers, and the general public.

The Library is global project of the WHO Global Traditional Medicine Centre (GTMC) and aims to foster collaborative knowledge exchange, facilitate evidence-based decision-making, and bridge the gap between traditional and conventional healthcare.

The Library Website operates an extensive range of databases, repositories, and digital tools, including the Integrative Public Health Modeler - a generative artificial intelligence tool developed by the Latin American and Caribbean Center for Health Sciences Information also known by its original name Biblioteca Regional de Medicina (BIREME – Regional Library of Medicine) which is a specialized center of the Pan American Health Organization (PAHO) and the World Health Organization (WHO). The Integrative Public Health Modeler helps curate, analyze, and create content related to traditional medicine and global public health, ensuring a balance between cultural insights and scientific evidence.

As a digital Library, the Library Website is not a publisher, but rather collects, indexes, and archives citations of literature published by contributors selected by WHO. Contributors include WHO Collaborating Centre on Traditional Medicine, Non-State Actors in official relationships with WHO, WHO networks, and Institutions designated or approved to work with WHO by Member State, and individual researchers who will submit information to the Library website. All information developed by contributors will be reviewed before going on the Library website.

Contributors must disclose any potential conflicts of interest that may influence the indexing and classification of content. Any activity that could compromise LIBRARY's integrity or objectivity should be avoided. The Library upholds transparency in all partnerships and collaborations.

The inclusion of any article, document, or citation in the Library collection does not imply endorsement or agreement by WHO with their content.

The Library Website is developed by the BIREME with GTMC.`,
    },
    {
      title: "General Disclaimer",
      content: `The designations employed and the presentation of the material in The Library, including maps and other illustrative materials, do not imply the expression of any opinion whatsoever on the part of World Health Organization (WHO) concerning the legal status of any country, territory, city, or area or of its authorities, or concerning the delimitation of its frontiers or boundaries. Dotted and dashed lines on maps represent approximate border lines for which there may not yet be full agreement.

The mention of specific companies or of certain manufacturers' products does not imply that they are endorsed or recommended by WHO in preference to others of a similar nature that are not mentioned. Errors and omissions excepted, the names of proprietary products are distinguished by initial capital letters.

All reasonable precautions have been taken by WHO to verify the information contained on the Library Website. However, the content published on it is being distributed without a warranty of any kind, either expressed or implied. The responsibility for the interpretation and use of the material lies with the reader. In no event shall WHO be liable for damages arising from its use.`,
    },
    {
      title: "Ethical Standards and Conduct",
      content: `WHO is committed to upholding the highest ethical standards in its operations. Integrity, transparency, and fairness guide all aspects of its data collection, indexing, and sharing. WHO is bound by its own ethical principles and expects all contributors, researchers, and institutional partners to maintain professionalism and integrity in their interactions with WHO.`,
    },
    {
      title: "Respect, Equality, and Diversity",
      content: `WHO promotes a culture of inclusivity, respect, and diversity. WHO does not tolerate discrimination, harassment, or abusive conduct based on gender, race, religion, national origin, age, disability, sexual orientation, or any other protected characteristic. Any claims of discrimination or harassment will be taken seriously and handled in accordance with WHO policies.`,
    },
    {
      title: "Avoidance of Conflicts of Interest",
      content: `Contributors, data providers and institutional partners working with the Library must disclose any potential conflicts of interest that may influence the indexing and classification of content. Any activity that could compromise LIBRARY's integrity or objectivity should be avoided. LIBRARY upholds transparency in all partnerships and collaborations.

Any search result generated by the Library, including citations and records in the database as well as any result generated by the Integrative Public Health Modeler, does not imply the expression of any legal opinion whatsoever on the part of the World Health Organization or Pan American Health Organization. The inclusion of any record in the Library collection does not imply endorsement or agreement by WHO or PAHO with its content. Users are encouraged to verify the accuracy and relevance of the information independently.`,
    },
    {
      title: "Indexing and Classification",
      content: `The WHO Traditional Medicine Global Library utilizes the DeCS (Descriptors in Health Sciences), a standardized multilingual thesaurus developed by BIREME, to facilitate the organization, indexing, and retrieval of content related to Traditional, Complementary, and Integrative Medicine (TICIM). The inclusion of DeCS descriptors in the Library does not imply endorsement or certification of the content by WHO.

The TM filters in the Library's iAHx interface are based on these descriptors to facilitate precise searching and retrieval of records. DeCS serves as a tool to enhance discoverability and improve access to scientific literature.`,
    },
    {
      title: "Thematic Instances",
      content: `Thematic instances developed collaboratively with national or institutional partners remain subject to WHO editorial oversight and must follow the Library's metadata, indexing, copyright and ethical standards.`,
    },
    {
      title: "Copyright and Usage Rights",
      content: `The Library is a product of the World Health Organization (WHO) and is made available under the terms of the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 IGO licence (CC BY-NC-SA 3.0 IGO; https://creativecommons.org/licenses/by-nc-sa/3.0/igo/). This licensing framework facilitates access to, and sharing of, the Library content while ensuring recognition of WHO's ownership and maintaining certain restrictions on use.

Licensing Terms

Under the CC BY-NC-SA 3.0 IGO license, users of the Library are permitted to:

Share: Copy and redistribute the Library content in any medium or format.
Adapt: Remix, transform, and build upon the material for non-commercial purposes, provided the adaptations are shared under the same license terms.

Conditions of Use

Attribution: Users must provide appropriate credit to the World Health Organization, link to the license, and indicate if changes were made. Attribution must not suggest endorsement by WHO or imply WHO's support for any derivative work.

Non-Commercial Use: the Library content may not be used for commercial purposes. Any use aimed at generating commercial advantage or monetary compensation is strictly prohibited without prior written authorization from WHO.

ShareAlike: If content is remixed, transformed, or built upon, the resulting work must be distributed under the same CC BY-NC-SA 3.0 IGO license.

Proprietary Rights

The Library name, logo, and any proprietary identifiers are protected by applicable intellectual property laws and may not be reproduced or used without explicit permission from WHO. Users may not imply an association with WHO through the use of LIBRARY content unless authorized in writing.

Exemptions and Permissions

Inquiries for permissions beyond the scope of the CC BY-NC-SA 3.0 IGO license, including commercial use or use of proprietary elements, should be directed to WHO through official communication channels.

If you adapt the work, then you must license your work under the same or equivalent Creative Commons license. If you create a translation of this work, you should add the following disclaimer along with the suggested citation: "This translation was not created by the World Health Organization (WHO). WHO is not responsible for the content or accuracy of this translation. The original English edition shall be the binding and authentic edition." Any mediation relating to disputes arising under the license shall be conducted in accordance with the mediation rules of the World Intellectual Property Organization.

Suggested citation: WHO Traditional Medicine Global Library. Geneva: World Health Organization; License: CC BY-NC-SA 3.0 IGO.`,
    },
    {
      title: "Accuracy and Liability",
      content: `The World Health Organization (WHO) endeavors to provide accurate, up-to-date, and reliable information through the Library. However, the content is provided "as is" and without any warranty of accuracy, completeness, or fitness for a particular purpose. Users are encouraged to verify the information independently before relying on it. WHO makes no representations or warranties regarding the completeness, reliability, or accuracy of LIBRARY content and expressly disclaims liability for any damage arising from its use.

WHO assumes no responsibility or liability for any errors, omissions, or inaccuracies in the Library content. The use of LIBRARY is at the user's own risk, and WHO will not be held liable for any consequences, including but not limited to, damages or losses resulting from the use of, or reliance on, LIBRARY content.

In the event of discrepancies or technical issues, users are encouraged to report them to WHO for review and potential correction. However, WHO's decision on any revisions remains final and is not subject to appeal.`,
    },
    {
      title: "Third-Party Content",
      content: `The Library may include content from third-party sources or external links. The inclusion of such content does not imply endorsement by WHO, and WHO is not responsible for the accuracy, completeness, or reliability of third-party materials. Users are encouraged to review the terms and conditions of any linked or referenced external content independently.

WHO does not guarantee the ongoing availability, accuracy, or functionality of third-party content linked through the Library. WHO is also not responsible for any changes, updates, or removals of third-party content that may occur over time.`,
    },
    {
      title: "Use of WHO Logo",
      content: `The use of WHO name, logo or emblem is subject to the prior express written approval of WHO. Users of, or contributors to the Library shall not use the name, acronym or emblem of WHO in any manner or for any purpose, without prior written consent by WHO.`,
    },
    {
      title: "Conflict Resolution",
      content: `Every effort will be made to resolve amicably any matter that may arise concerning the Library Website [and the contributions]. In the unlikely event an amicable resolution cannot be found, the matter will be resolved by conciliation or by arbitration in accordance with the UNCITRAL Arbitration Rules, with the arbitral award being final.`,
    },
  ];

  return (
    <div className={styles.DisclaimerMultitabContainer}>
      <Container py={40} size={"xl"}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 12 }}>
            <Tabs 
              defaultValue="index0" 
              orientation={isMobile ? "horizontal" : "vertical"}
              classNames={styles}
            >
              <Tabs.List className={styles.DisclaimerTabList}>
                {sections.map((section, k) => (
                  <Tabs.Tab
                    key={k}
                    value={`index${k}`}
                    className={styles.DisclaimerTabButton}
                  >
                    <span className={styles.DisclaimerTabTitle}>{section.title}</span>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              {sections.map((section, k) => (
                <Tabs.Panel key={k} value={`index${k}`}>
                  <div className={styles.DisclaimerTabContent}>
                    {section.content.split("\n\n").map((paragraph, pIndex) => (
                      <p key={pIndex} style={{ marginBottom: "1em" }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </Tabs.Panel>
              ))}
            </Tabs>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

