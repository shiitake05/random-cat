import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

type Image = {
    url: string;
  };

// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
};
 
// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
    const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
    const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく
    // useEffect(() => {
    //   fetchImage().then((newImage) => {
    //     setImageUrl(newImage.url); // 画像URLの状態を更新する
    //     setLoading(false); // ローディング状態を更新する
    //   });
    // }, []);
    // ボタンをクリックしたときに画像を読み込む処理
  const handleClick = async () => {
    setLoading(true); // 読込中フラグを立てる
    const newImage = await fetchImage();
    setImageUrl(newImage.url); // 画像URLの状態を更新する
    setLoading(false); // 読込中フラグを倒す
  };
  return (
    <div className={styles.page}>
        <button onClick={handleClick} className={styles.button}>
            他のにゃんこも見る
        </button>
        <div className={styles.frame}>
            {loading || <img src={imageUrl} className={styles.img} />}
        </div>
    </div>
  );
};
  export default IndexPage;

  // サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
      props: {
        initialImageUrl: image.url,
      },
    };
  };
 
const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images: unknown = await res.json();
    if (!Array.isArray(images)) {
      throw new Error("猫の画像が取得できませんでした");
    }
    const image: unknown = images[0];
    if (!isImage(image)) {
      throw new Error("猫の画像が取得できませんでした");
    }
    return image;
  };
   
  // 型ガード関数
  const isImage = (value: unknown): value is Image => {
    if (!value || typeof value !== "object") {
      return false;
    }
    return "url" in value && typeof value.url === "string";
  };