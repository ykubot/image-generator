import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })
interface ChatGPTResponse {
  result: GeneratedImage[];
}

interface GeneratedImage {
  url: string;
}

export default function Home() {
  const [inputText, setInputText] = useState('a cat sitting on a couch');
  const [imageSize, setImageSize] = useState("256x256");
  const [numImages, setNumImages] = useState(1);
  const [imageURLs, setImageURLs] = useState<GeneratedImage[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText,
          imageSize,
          numImages
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data);
      setImageURLs(data.result);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {

    }
  };

  const handleChange = (event: any) => {
    setImageSize(event.target.value);
  };


  return (
    <>
      <Head>
        <title>OpenAI画像生成アプリ</title>
        <meta name="description" content="AI が画像を生成します" />
      </Head>

      <h1 className="text-2xl font-bold leading-3 text-gray-900 m-5">OpenAI画像生成アプリ</h1>

      <div className="mx-4 my-2 p-4 flex-auto bg-white shadow rounded-md">
        <form onSubmit={handleSubmit}>

          <div className="flex flex-wrap">

            <div className="w-1/2 pr-4 py-2">
              <h2 className="block text-sm font-medium leading-6 text-gray-900">生成したい画像の内容（英語：例 a cat sitting on the couch）：</h2>
              <textarea
                rows={4}
                className="px-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
              />
            </div>

            <div className="w-1/2 pl-4 py-2">
              <div>
                <h2 className="block text-sm font-medium leading-6 text-gray-900">生成する画像の数（1 - 10 で指定）:</h2>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numImages}
                  onChange={(event: any) => setNumImages(event.target.value)}
                  className="block w-1/6 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-4">
                <h2 className="block text-sm font-medium leading-6 text-gray-900">画像サイズ:</h2>
                <div className="flex block text-sm font-medium leading-6 text-gray-900">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="imagesize"
                      value="256x256"
                      checked={imageSize === "256x256"}
                      onChange={handleChange}
                    />
                    256x256
                  </label>

                  <label className="mr-3">
                    <input
                      type="radio"
                      name="imagesize"
                      value="512x512"
                      onChange={handleChange}
                    />
                    512x512
                  </label>

                  <label className="mr-3">
                    <input
                      type="radio"
                      name="imagesize"
                      value="1024x1024"
                      onChange={handleChange}
                    />
                    1024x1024
                  </label>
                </div>
              </div>

            </div>

            <div className="py-3">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                画像を生成する
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mx-4 my-2 p-4 flex-auto bg-white shadow rounded-md">
        <h2 className="block text-sm font-medium leading-6 text-gray-900">生成結果：</h2>
        {imageURLs.length > 0 && (
          <div className="flex">
            {imageURLs.map((item, index) => (
              <div className="mr-2" key={index}>
                <img src={item.url} alt={`generated image ${index}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
