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
};

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
}

const githubRefTypes = new Set<GitHubRefType>([RefTypes.Issue, RefTypes.PullRequest]);

const gitlabRefTypes = new Set<GitLabRefType>([RefTypes.Issue, RefTypes.MergeRequest]);

const khronosGithubBase = 'https://github.com/KhronosGroup/';

const baseUrls = {
    [Repos.InternalGitlab]: "https://gitlab.khronos.org/openxr/openxr",
    [Repos.OpenXRDocs]: khronosGithubBase + getGithubRepoName(Repos.OpenXRDocs),
    [Repos.OpenXRSDKSource]: khronosGithubBase + getGithubRepoName(Repos.OpenXRSDKSource),
    [Repos.OpenXRCTS]: khronosGithubBase + getGithubRepoName(Repos.OpenXRCTS),
}
const isGitHubRepo = (repo: Repo): boolean => repo != Repos.InternalGitlab;

export const CodeChangeRefType = {
    [Repos.InternalGitlab]: RefTypes.MergeRequest,
    [Repos.OpenXRDocs]: RefTypes.PullRequest,
    [Repos.OpenXRSDKSource]: RefTypes.PullRequest,
    [Repos.OpenXRCTS]: RefTypes.PullRequest,
};

// export const CodeChangeRefType = (()=>{
//     return Object.fromEntries()
// })();

interface GitLabReference {
    repo: GitLabRepo,
    refType: GitLabRefType,
    refNumber: number
};

interface GitHubReference {
    repo: GitHubRepo,
    refType: GitHubRefType,
    refNumber: number
}

type GeneralReference = GitHubReference | GitLabReference;

export const AllRepos = Object.values(Repos);

export const getMostSimilarRefTypeForRepo = (repo: Repo, origRefType: RefType): RefType =>
    (origRefType == RefTypes.MergeRequest || origRefType == RefTypes.PullRequest)
        ? CodeChangeRefType[repo]
        : RefTypes.Issue;

const getValidRefTypesForRepo =
    (repo: Repo): Set<RefType> => (repo == Repos.InternalGitlab) ? gitlabRefTypes : githubRefTypes;

// export const ValidRefTypes: Map<Repo, Set<RefType>> = (() => {
//     return new Map<Repo, Set<RefType>>(
//         AllRepos.map((r) =>
//             [r, (r == Repos.InternalGitlab) ? gitlabRefTypes : githubRefTypes])
//     );
// })()
export const ValidRefTypes = (() => {
    return Object.fromEntries(
        AllRepos.map((r) =>
            [r, (r == Repos.InternalGitlab) ? gitlabRefTypes : githubRefTypes])
    );
})()

export class Reference {
    private _repo: Repo;
    get repo(): Repo {
        return this._repo;
    }
    set repo(newRepo: Repo) {
        if (!getValidRefTypesForRepo(newRepo).has(this._refType)) {
            throw new Error(`Cannot set repo to ${newRepo} when refType is ${this.refType}`);
        }
        this._repo = newRepo;
    }

    private _refType: RefType;
    get refType(): RefType {
        return this._refType;
    }
    set refType(newRefType: RefType) {
        if (!getValidRefTypesForRepo(this.repo).has(newRefType)) {
            throw new Error(`Cannot set refType to ${newRefType} when repo is ${this.repo}`);
        }
        this._refType = newRefType;
    }

    refNumber: Number;

    get url(): string {
        return `${baseUrls}/${subdir[this.refType]}/${this.refNumber}`;
    }

    constructor(repo: Repo, refType: RefType, refNumber: Number) {
        this.repo = repo;
        this.refType = refType;
        this.refNumber = refNumber;
        if (!getValidRefTypesForRepo(repo).has(this.refType)) {
            throw new Error(`Cannot set repo to ${repo} and refType to ${refType}`)
        }
    }


}