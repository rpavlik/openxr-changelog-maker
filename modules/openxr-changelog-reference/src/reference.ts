// enum GitlabRepo {
//     InternalGitlab = "gl",

// }
// enum GitHubRepo {

export const RefTypes = {
    Issue: "Issue",
    PullRequest: "Pull Request",
    MergeRequest: "Merge Request"
} as const;


type GitHubRepo = "gh.OpenXR-Docs" | "gh.OpenXR-SDK-Source" | "gh.OpenXR-CTS";
type GitLabRepo = "gl";
type Repo = GitHubRepo | GitLabRepo;
export type { GitHubRepo, GitLabRepo, Repo };

export const Repos = {
    InternalGitlab: "gl",
    OpenXRDocs: "gh.OpenXR-Docs",
    OpenXRSDKSource: "gh.OpenXR-SDK-Source",
    OpenXRCTS: "gh.OpenXR-CTS",
} as const;

const subdir = {
    [RefTypes.Issue]: 'issues',
    [RefTypes.PullRequest]: 'pull',
    [RefTypes.MergeRequest]: 'merge_requests',
} as const;;

// type GitHubRepo = Repo.OpenXRDocs | Repo.OpenXRSDKSource | Repo.OpenXRCTS
export type GitHubRefType = "Issue" | "Pull Request";
export type GitLabRefType = "Issue" | "Merge Request";
export type RefType = GitHubRefType | GitLabRefType;
// export type { GitHubRefType, GitLabRefType, RefType };

function getGithubRepoName(repo: GitHubRepo) {
    return repo.replace('gh.', '');
}

export const RepoHumanName = {
    [Repos.InternalGitlab]: 'Khronos internal OpenXR repo',
    [Repos.OpenXRDocs]: `GitHub repo ${getGithubRepoName(Repos.OpenXRDocs)}`,
    [Repos.OpenXRSDKSource]: `GitHub repo ${getGithubRepoName(Repos.OpenXRSDKSource)}`,
    [Repos.OpenXRCTS]: `GitHub repo ${getGithubRepoName(Repos.OpenXRCTS)}`,
} as const;

const khronosGithubBase = 'https://github.com/KhronosGroup/';

const baseUrls = {
    [Repos.InternalGitlab]: "https://gitlab.khronos.org/openxr/openxr",
    [Repos.OpenXRDocs]: khronosGithubBase + getGithubRepoName(Repos.OpenXRDocs),
    [Repos.OpenXRSDKSource]: khronosGithubBase + getGithubRepoName(Repos.OpenXRSDKSource),
    [Repos.OpenXRCTS]: khronosGithubBase + getGithubRepoName(Repos.OpenXRCTS),
} as const;

export const CodeChangeRefType = {
    [Repos.InternalGitlab]: RefTypes.MergeRequest,
    [Repos.OpenXRDocs]: RefTypes.PullRequest,
    [Repos.OpenXRSDKSource]: RefTypes.PullRequest,
    [Repos.OpenXRCTS]: RefTypes.PullRequest,
} as const;;

// export const CodeChangeRefType = (()=>{
//     return Object.fromEntries()
// })();

export interface GitLabReference {
    repo: GitLabRepo,
    refType: GitLabRefType,
    refNumber: number
};

export interface GitHubReference {
    repo: GitHubRepo,
    refType: GitHubRefType,
    refNumber: number
}

export type StrictGeneralReference = GitHubReference | GitLabReference;

export interface GeneralReference {
    repo: Repo,
    refType: RefType,
    refNumber: number
}

export const AllRepos = Object.values(Repos);

export const getMostSimilarRefTypeForRepo = (repo: Repo, origRefType: RefType): RefType =>
    (origRefType == RefTypes.MergeRequest || origRefType == RefTypes.PullRequest)
        ? CodeChangeRefType[repo]
        : RefTypes.Issue;

const githubRefTypes = new Set<GitHubRefType>([RefTypes.Issue, RefTypes.PullRequest]);

const gitlabRefTypes = new Set<GitLabRefType>([RefTypes.Issue, RefTypes.MergeRequest]);

// const getValidRefTypesForRepo =
//     (repo: Repo): Set<RefType> => (repo == Repos.InternalGitlab) ? gitlabRefTypes : githubRefTypes;

// export const ValidRefTypes: Map<Repo, Set<RefType>> = (() => {
//     return new Map<Repo, Set<RefType>>(
//         AllRepos.map((r) =>
//             [r, (r == Repos.InternalGitlab) ? gitlabRefTypes : githubRefTypes])
//     );
// })()
export const ValidRefTypes: { [index in Repo]: Set<RefType> } = (() => {
    let pairs: Array<[Repo, Set<RefType>]> = AllRepos.map((r) =>
        [r, (r == 'gl') ? gitlabRefTypes : githubRefTypes]);
    return Object.fromEntries(pairs) as { [index in Repo]: Set<RefType> };
})();

export function isReferenceValid (ref: GeneralReference): boolean {
    if (!ref.repo || !ref.refType || !ref.refNumber) {
        return false;
    }
    return ValidRefTypes[ref.repo].has(ref.refType);
}

export function makeUrl(ref: StrictGeneralReference): string {
    return `${baseUrls[ref.repo]}/${subdir[ref.refType]}/${ref.refNumber}`;
}

export function makeRefString(ref: StrictGeneralReference): string {
    return `${ref.refType}.${ref.refNumber}.${ref.repo}`;
}

// export class Reference {
//     private _repo: Repo;
//     get repo(): Repo {
//         return this._repo;
//     }
//     set repo(newRepo: Repo) {
//         if (!getValidRefTypesForRepo(newRepo).has(this._refType)) {
//             throw new Error(`Cannot set repo to ${newRepo} when refType is ${this.refType}`);
//         }
//         this._repo = newRepo;
//     }

//     private _refType: RefType;
//     get refType(): RefType {
//         return this._refType;
//     }
//     set refType(newRefType: RefType) {
//         if (!getValidRefTypesForRepo(this.repo).has(newRefType)) {
//             throw new Error(`Cannot set refType to ${newRefType} when repo is ${this.repo}`);
//         }
//         this._refType = newRefType;
//     }

//     refNumber: number;


//     constructor(repo: Repo, refType: RefType, refNumber: number) {
//         this.repo = repo;
//         this.refType = refType;
//         this.refNumber = refNumber;
//         if (!getValidRefTypesForRepo(repo).has(this.refType)) {
//             throw new Error(`Cannot set repo to ${repo} and refType to ${refType}`)
//         }
//     }


// }