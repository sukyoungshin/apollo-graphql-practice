"use client";
import { ChangeEvent, FormEvent, useState } from "react";

type MemberType = {
  team: string;
  userName: string;
  job: string;
  gender: string;
};

// DELETE: 목데이터, 차후 삭제
const teams = [
  { en: "e-commerce", kr: "커머스 플랫폼" },
  { en: "service", kr: "서비스 플랫폼" },
  { en: "po", kr: "서비스기획" },
];
const jobs = [
  { en: "frontend developer", kr: "프론트앤드 개발자" },
  { en: "backend developer", kr: "백앤드 개발자" },
  { en: "web designer", kr: "웹 디자이너" },
  { en: "project manager", kr: "기획자" },
];
const genders = [
  { en: "female", kr: "여성" },
  { en: "male", kr: "남성" },
  { en: "none", kr: "선택안함" },
];

export default function Home() {
  const [memberInfo, updateMemberInfo] = useState<MemberType>({
    team: teams[0].en,
    userName: "",
    job: jobs[0].en,
    gender: genders[0].en,
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMemberInfo({ ...memberInfo });
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    updateMemberInfo({
      ...memberInfo,
      [name]: value,
    });
  };
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const { selectedIndex } = options;

    updateMemberInfo({
      ...memberInfo,
      [name]: options[selectedIndex].value,
    });
  };

  return (
    <main>
      <form onSubmit={onSubmit}>
        <label
          htmlFor="team"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          팀 :{" "}
        </label>
        <select id="team" name="team" onChange={onSelectChange}>
          {teams.map((teamItem) => (
            <option key={teamItem.en} value={teamItem.en}>
              {teamItem.kr}
            </option>
          ))}
        </select>

        <br />
        <label
          htmlFor="job"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          직무 :{" "}
        </label>
        <select id="job" name="job" onChange={onSelectChange}>
          {jobs.map((jobItem) => (
            <option key={`${jobItem.en}`} value={jobItem.en}>
              {jobItem.kr}
            </option>
          ))}
        </select>
        <br />

        <label
          htmlFor="userName"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          성함 :{" "}
        </label>
        <input
          id="userName"
          name="userName"
          value={memberInfo.userName}
          onChange={onInputChange}
          placeholder="성함"
          maxLength={5}
          required
        />
        <br />
        <label
          htmlFor="gender"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          성별 :{" "}
        </label>
        <select id="gender" name="gender" onChange={onSelectChange}>
          {genders.map((gender) => (
            <option key={gender.en} value={gender.en}>
              {gender.kr}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          추가하기
        </button>
      </form>
    </main>
  );
}
