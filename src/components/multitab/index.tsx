import { MultTabItems } from "@/services/types/posts.dto";
import { Tabs } from "@mantine/core";
import styles from "../../styles/components/multitab.module.scss";

export interface MultitabsProps {
  props: MultTabItems[];
}

export const Multitabs = ({ props }: MultitabsProps) => {
  if (props.length > 0) {
    return (
      <div className={styles.MultitabContainer}>
        <Tabs defaultValue={props[0].tab_name} classNames={styles}>
          <Tabs.List>
            {props.map((item, k) => (
              <Tabs.Tab key={k} value={item.tab_name}>
                <span className={styles.tabItemName}>
                  {item.tab_name.toUpperCase()}
                </span>
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {props.map((item, k) => (
            <Tabs.Panel key={k} value={item.tab_name}>
              <div className={styles.InternalTabContent}>
                <h3>{item.tab_name}</h3>
                <div className={styles.InternalBox}>
                  {item.tab_items ? (
                    <>
                      {item.tab_items?.length > 0 ? (
                        <>
                          <Tabs
                            defaultValue={item.tab_items[0].item_name}
                            orientation="vertical"
                            classNames={styles}
                          >
                            <Tabs.List>
                              {item.tab_items?.map((item, key) => (
                                <Tabs.Tab key={key} value={item.item_name}>
                                  <span className={styles.tabItemName}>
                                    {" "}
                                    {item.item_name}
                                  </span>
                                </Tabs.Tab>
                              ))}
                            </Tabs.List>
                            {item.tab_items?.map((item, key) => (
                              <Tabs.Panel key={key} value={item.item_name}>
                                <div
                                  className={styles.InternalTabContentContainer}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.item_content
                                        ? item.item_content
                                        : "",
                                    }}
                                  />
                                </div>
                              </Tabs.Panel>
                            ))}
                          </Tabs>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    );
  }
};
